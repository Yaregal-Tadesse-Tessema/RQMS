import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { Project } from "../roads/entities/project.entity";
import { Road } from "../roads/entities/road.entity";
import { RoadSection } from "../roads/entities/road-section.entity";
import { WorkItem } from "../roads/entities/work-item.entity";
import { DailyProgress } from "../roads/entities/daily-progress.entity";
import { FuelIssue } from "../machinery/entities/fuel-issue.entity";
import { FuelRequest } from "../machinery/entities/fuel-request.entity";
import { SafetyInspection } from "../safety/entities/safety-inspection.entity";
import { Incident } from "../safety/entities/incident.entity";
import { EnvironmentalRecord } from "../environment/entities/environmental-record.entity";
import { Grievance } from "../grievance/entities/grievance.entity";
import { Inspection } from "../qa/entities/inspection.entity";
import { ReworkRecord } from "../qa/entities/rework-record.entity";
import { DashboardOverviewDto } from "./dto/dashboard-overview.dto";
import { ProjectDashboardDto } from "./dto/project-dashboard.dto";

function toYmd(date: Date): string {
  // Use UTC to avoid server-local timezone surprises.
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(Road) private readonly roadRepo: Repository<Road>,
    @InjectRepository(RoadSection) private readonly sectionRepo: Repository<RoadSection>,
    @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(DailyProgress) private readonly progressRepo: Repository<DailyProgress>,
    @InjectRepository(Inspection) private readonly inspectionRepo: Repository<Inspection>,
    @InjectRepository(ReworkRecord) private readonly reworkRepo: Repository<ReworkRecord>,
    @InjectRepository(FuelRequest) private readonly fuelRequestRepo: Repository<FuelRequest>,
    @InjectRepository(FuelIssue) private readonly fuelIssueRepo: Repository<FuelIssue>,
    @InjectRepository(SafetyInspection) private readonly safetyInspectionRepo: Repository<SafetyInspection>,
    @InjectRepository(Incident) private readonly incidentRepo: Repository<Incident>,
    @InjectRepository(EnvironmentalRecord) private readonly envRepo: Repository<EnvironmentalRecord>,
    @InjectRepository(Grievance) private readonly grievanceRepo: Repository<Grievance>
  ) {}

  async getOverview(user: User): Promise<DashboardOverviewDto> {
    const recentProjects = await this.roads.listProjectsForUser(user);

    return {
      projectsCount: recentProjects.length,
      recentProjects: recentProjects.slice(0, 6).map((p) => ({
        id: p.id,
        name: p.name,
        projectType: p.projectType,
        createdAt: p.createdAt.toISOString()
      }))
    };
  }

  async getProjectDashboard(user: User, projectId: string, workDate?: string): Promise<ProjectDashboardDto> {
    await this.roads.ensureProjectMember(projectId, user);

    const effectiveWorkDate = (workDate && workDate.trim().length > 0 ? workDate : toYmd(new Date())).slice(0, 10);

    const roadsCount = await this.roadRepo.count({ where: { projectId } });

    const sectionsCount = await this.sectionRepo
      .createQueryBuilder("s")
      .innerJoin(Road, "r", "r.id = s.roadId")
      .where("r.projectId = :projectId", { projectId })
      .getCount();

    const workItemsCount = await this.workItemRepo
      .createQueryBuilder("w")
      .innerJoin(RoadSection, "s", "s.id = w.sectionId")
      .innerJoin(Road, "r", "r.id = s.roadId")
      .where("r.projectId = :projectId", { projectId })
      .getCount();

    const progressAgg = await this.progressRepo
      .createQueryBuilder("p")
      .innerJoin(WorkItem, "w", "w.id = p.workItemId")
      .innerJoin(RoadSection, "s", "s.id = w.sectionId")
      .innerJoin(Road, "r", "r.id = s.roadId")
      .where("r.projectId = :projectId", { projectId })
      .andWhere("p.workDate = :workDate", { workDate: effectiveWorkDate })
      .select("COUNT(*)::int", "count")
      .addSelect("COALESCE(SUM(p.quantity), 0)", "sum")
      .getRawOne<{ count: number; sum: string }>();

    const openFailedReworks = await this.reworkRepo
      .createQueryBuilder("rw")
      .innerJoin(Inspection, "i", "i.id = rw.inspectionId")
      .where("i.projectId = :projectId", { projectId })
      .andWhere("i.outcome = 'fail'")
      .andWhere("rw.status = 'open'")
      .getCount();

    const fuelRequestsRequested = await this.fuelRequestRepo.count({ where: { projectId, status: "requested" } });
    const fuelRequestsApproved = await this.fuelRequestRepo.count({ where: { projectId, status: "approved" } });
    const fuelIssues = await this.fuelIssueRepo.count({ where: { projectId } });

    const safetyInspections = await this.safetyInspectionRepo.count({ where: { projectId } });
    const incidents = await this.incidentRepo.count({ where: { projectId } });

    const environmentalRecords = await this.envRepo.count({ where: { projectId } });

    const grievancesTotal = await this.grievanceRepo.count({ where: { projectId } });
    const grievancesOpen = await this.grievanceRepo
      .createQueryBuilder("g")
      .where("g.projectId = :projectId", { projectId })
      .andWhere("g.status != 'closed'")
      .getCount();

    const recentFuelRequests = await this.fuelRequestRepo.find({
      where: { projectId },
      order: { createdAt: "DESC" },
      take: 6
    });

    const recentIncidents = await this.incidentRepo.find({
      where: { projectId },
      order: { occurredAt: "DESC" },
      take: 6
    });

    const recentEnvironmentalRecords = await this.envRepo.find({
      where: { projectId },
      order: { capturedAt: "DESC" },
      take: 6
    });

    const recentGrievances = await this.grievanceRepo.find({
      where: { projectId },
      order: { createdAt: "DESC" },
      take: 6
    });

    return {
      projectId,
      workDate: effectiveWorkDate,
      counts: {
        roads: roadsCount,
        sections: sectionsCount,
        workItems: workItemsCount,
        progressEntriesOnDate: Number(progressAgg?.count ?? 0),
        progressQuantityOnDate: Number(progressAgg?.sum ?? 0),
        openFailedReworks,
        fuelRequestsRequested,
        fuelRequestsApproved,
        fuelIssues,
        safetyInspections,
        incidents,
        environmentalRecords,
        grievancesOpen,
        grievancesTotal
      },
      recentFuelRequests: recentFuelRequests.map((r) => ({
        id: r.id,
        status: r.status,
        requestedLiters: r.requestedLiters,
        createdAt: r.createdAt.toISOString()
      })),
      recentIncidents: recentIncidents.map((i) => ({
        id: i.id,
        occurredAt: i.occurredAt.toISOString(),
        severity: i.severity,
        description: i.description
      })),
      recentEnvironmentalRecords: recentEnvironmentalRecords.map((e) => ({
        id: e.id,
        parameter: e.parameter,
        value: e.value,
        unit: e.unit,
        capturedAt: e.capturedAt.toISOString()
      })),
      recentGrievances: recentGrievances.map((g) => ({
        id: g.id,
        status: g.status,
        description: g.description,
        createdAt: g.createdAt.toISOString()
      }))
    };
  }
}

