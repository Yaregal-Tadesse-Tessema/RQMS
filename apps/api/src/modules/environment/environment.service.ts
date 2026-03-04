import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { EnvironmentalRecord } from "./entities/environmental-record.entity";

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(EnvironmentalRecord) private readonly records: Repository<EnvironmentalRecord>
  ) {}

  async createRecord(user: User, input: { projectId: string; capturedAt: Date; parameter: string; value?: number; unit?: string; notes?: string }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    return await this.records.save(
      this.records.create({
        projectId: input.projectId,
        capturedAt: input.capturedAt,
        parameter: input.parameter,
        value: input.value ?? null,
        unit: input.unit ?? null,
        notes: input.notes ?? null,
        createdByUserId: user.id
      })
    );
  }

  async listRecords(user: User, projectId: string) {
    await this.roads.ensureProjectMember(projectId, user);
    return await this.records.find({ where: { projectId }, order: { capturedAt: "DESC" } });
  }
}

