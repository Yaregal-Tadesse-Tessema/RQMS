import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { Incident } from "./entities/incident.entity";
import { SafetyInspection } from "./entities/safety-inspection.entity";

@Injectable()
export class SafetyService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(SafetyInspection) private readonly inspections: Repository<SafetyInspection>,
    @InjectRepository(Incident) private readonly incidents: Repository<Incident>
  ) {}

  async createInspection(user: User, input: { projectId: string; inspectionDate: string; title?: string; notes?: string }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    return await this.inspections.save(
      this.inspections.create({
        projectId: input.projectId,
        inspectionDate: input.inspectionDate,
        title: input.title ?? null,
        notes: input.notes ?? null,
        createdByUserId: user.id
      })
    );
  }

  async listInspections(user: User, projectId: string) {
    await this.roads.ensureProjectMember(projectId, user);
    return await this.inspections.find({ where: { projectId }, order: { createdAt: "DESC" } });
  }

  async createIncident(user: User, input: { projectId: string; occurredAt: Date; severity: "low" | "medium" | "high"; description: string; lat?: number; lng?: number }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    return await this.incidents.save(
      this.incidents.create({
        projectId: input.projectId,
        occurredAt: input.occurredAt,
        severity: input.severity,
        description: input.description,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        createdByUserId: user.id
      })
    );
  }

  async listIncidents(user: User, projectId: string) {
    await this.roads.ensureProjectMember(projectId, user);
    return await this.incidents.find({ where: { projectId }, order: { createdAt: "DESC" } });
  }
}

