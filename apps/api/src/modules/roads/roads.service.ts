import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { DailyProgress } from "./entities/daily-progress.entity";
import { ProjectMembership } from "./entities/project-membership.entity";
import { Project } from "./entities/project.entity";
import { Road } from "./entities/road.entity";
import { RoadElement } from "./entities/road-element.entity";
import { RoadFeature } from "./entities/road-feature.entity";
import { RoadSection } from "./entities/road-section.entity";
import { WorkItem } from "./entities/work-item.entity";
import { Inspection } from "../qa/entities/inspection.entity";
import { ReworkRecord } from "../qa/entities/rework-record.entity";

@Injectable()
export class RoadsService {
  constructor(
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(ProjectMembership) private readonly memberships: Repository<ProjectMembership>,
    @InjectRepository(Road) private readonly roads: Repository<Road>,
    @InjectRepository(RoadSection) private readonly sections: Repository<RoadSection>,
    @InjectRepository(RoadElement) private readonly elements: Repository<RoadElement>,
    @InjectRepository(RoadFeature) private readonly features: Repository<RoadFeature>,
    @InjectRepository(WorkItem) private readonly workItems: Repository<WorkItem>,
    @InjectRepository(DailyProgress) private readonly progress: Repository<DailyProgress>,
    @InjectRepository(Inspection) private readonly inspections: Repository<Inspection>,
    @InjectRepository(ReworkRecord) private readonly reworks: Repository<ReworkRecord>
  ) {}

  async addProgress(
    user: User,
    input: {
      workItemId: string;
      workDate: string;
      quantity: number;
      fromChainage?: number | null;
      toChainage?: number | null;
      lat?: number | null;
      lng?: number | null;
      weather?: Record<string, unknown> | null;
      notes?: string | null;
    }
  ) {
    const workItem = await this.workItems.findOne({
      where: { id: input.workItemId },
      relations: { section: { road: true } }
    });
    if (!workItem) throw new NotFoundException("Work item not found");
    await this.ensureProjectMember(workItem.section.road.projectId, user);

    const openFailed = await this.reworks
      .createQueryBuilder("r")
      .innerJoin(Inspection, "i", "i.id = r.inspectionId")
      .where("i.workItemId = :workItemId", { workItemId: input.workItemId })
      .andWhere("i.outcome = 'fail'")
      .andWhere("r.status = 'open'")
      .getRawMany();

    if (openFailed.length > 0) {
      throw new ForbiddenException("Work is blocked due to a failed inspection (open rework)");
    }

    return await this.progress.save(
      this.progress.create({
        workItemId: input.workItemId,
        workDate: input.workDate,
        quantity: input.quantity,
        fromChainage: input.fromChainage ?? null,
        toChainage: input.toChainage ?? null,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        weather: input.weather ?? null,
        notes: input.notes ?? null,
        createdByUserId: user.id
      })
    );
  }

  async ensureProjectMember(projectId: string, user: User): Promise<void> {
    const membership = await this.memberships.findOne({ where: { projectId, userId: user.id } });
    if (!membership) {
      throw new ForbiddenException("Not a member of this project");
    }
  }

  async createProject(user: User, input: Pick<Project, "name" | "projectType">): Promise<Project> {
    const project = await this.projects.save(this.projects.create(input));
    await this.memberships.save(
      this.memberships.create({
        projectId: project.id,
        userId: user.id,
        role: "owner"
      })
    );
    return project;
  }

  async listProjectsForUser(user: User): Promise<Project[]> {
    return await this.projects
      .createQueryBuilder("p")
      .innerJoin(ProjectMembership, "m", "m.projectId = p.id AND m.userId = :userId", { userId: user.id })
      .orderBy("p.createdAt", "DESC")
      .getMany();
  }

  async createRoad(projectId: string, user: User, input: Pick<Road, "name" | "code" | "roadType">): Promise<Road> {
    await this.ensureProjectMember(projectId, user);
    return await this.roads.save(
      this.roads.create({
        projectId,
        name: input.name,
        code: input.code,
        roadType: input.roadType ?? null
      })
    );
  }

  async listRoads(projectId: string, user: User): Promise<Road[]> {
    await this.ensureProjectMember(projectId, user);
    return await this.roads.find({ where: { projectId }, order: { createdAt: "DESC" } });
  }

  async createSection(roadId: string, user: User, input: Partial<RoadSection>): Promise<RoadSection> {
    const road = await this.roads.findOne({ where: { id: roadId } });
    if (!road) throw new NotFoundException("Road not found");
    await this.ensureProjectMember(road.projectId, user);
    return await this.sections.save(
      this.sections.create({
        roadId,
        name: String(input.name),
        startChainage: input.startChainage ?? null,
        endChainage: input.endChainage ?? null
      })
    );
  }

  async listSections(roadId: string, user: User): Promise<RoadSection[]> {
    const road = await this.roads.findOne({ where: { id: roadId } });
    if (!road) throw new NotFoundException("Road not found");
    await this.ensureProjectMember(road.projectId, user);
    return await this.sections.find({ where: { roadId }, order: { createdAt: "DESC" } });
  }

  async addElement(sectionId: string, user: User, input: Partial<RoadElement>): Promise<RoadElement> {
    const section = await this.sections.findOne({ where: { id: sectionId }, relations: { road: true } });
    if (!section) throw new NotFoundException("Section not found");
    await this.ensureProjectMember(section.road.projectId, user);
    return await this.elements.save(
      this.elements.create({
        sectionId,
        elementType: String(input.elementType),
        fromChainage: input.fromChainage ?? null,
        toChainage: input.toChainage ?? null
      })
    );
  }

  async addFeature(sectionId: string, user: User, input: Partial<RoadFeature>): Promise<RoadFeature> {
    const section = await this.sections.findOne({ where: { id: sectionId }, relations: { road: true } });
    if (!section) throw new NotFoundException("Section not found");
    await this.ensureProjectMember(section.road.projectId, user);
    return await this.features.save(
      this.features.create({
        sectionId,
        featureType: String(input.featureType),
        chainage: input.chainage ?? null,
        lat: input.lat ?? null,
        lng: input.lng ?? null
      })
    );
  }

  async createWorkItem(sectionId: string, user: User, input: Partial<WorkItem>): Promise<WorkItem> {
    const section = await this.sections.findOne({ where: { id: sectionId }, relations: { road: true } });
    if (!section) throw new NotFoundException("Section not found");
    await this.ensureProjectMember(section.road.projectId, user);
    return await this.workItems.save(
      this.workItems.create({
        sectionId,
        roadElementId: input.roadElementId ?? null,
        roadFeatureId: input.roadFeatureId ?? null,
        workLayerId: input.workLayerId ?? null,
        activityTypeId: input.activityTypeId ?? null,
        name: String(input.name),
        unit: String(input.unit)
      })
    );
  }

  async listWorkItems(sectionId: string, user: User): Promise<WorkItem[]> {
    const section = await this.sections.findOne({ where: { id: sectionId }, relations: { road: true } });
    if (!section) throw new NotFoundException("Section not found");
    await this.ensureProjectMember(section.road.projectId, user);
    return await this.workItems.find({ where: { sectionId }, order: { createdAt: "DESC" } });
  }
}
