import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { GrievanceAction } from "./entities/grievance-action.entity";
import { Grievance } from "./entities/grievance.entity";

@Injectable()
export class GrievanceService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(Grievance) private readonly grievances: Repository<Grievance>,
    @InjectRepository(GrievanceAction) private readonly actions: Repository<GrievanceAction>
  ) {}

  async create(user: User, input: { projectId: string; description: string; complainantName?: string; complainantContact?: string }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    return await this.grievances.save(
      this.grievances.create({
        projectId: input.projectId,
        description: input.description,
        complainantName: input.complainantName ?? null,
        complainantContact: input.complainantContact ?? null,
        status: "open",
        assignedToUserId: null,
        createdByUserId: user.id
      })
    );
  }

  async list(user: User, projectId: string) {
    await this.roads.ensureProjectMember(projectId, user);
    return await this.grievances.find({ where: { projectId }, order: { createdAt: "DESC" } });
  }

  async addAction(user: User, input: { grievanceId: string; actionType: string; note?: string }) {
    const grievance = await this.grievances.findOne({ where: { id: input.grievanceId } });
    if (!grievance) throw new NotFoundException("Grievance not found");
    await this.roads.ensureProjectMember(grievance.projectId, user);

    if (input.actionType === "close") {
      grievance.status = "closed";
      await this.grievances.save(grievance);
    }

    return await this.actions.save(
      this.actions.create({
        grievanceId: input.grievanceId,
        actionType: input.actionType,
        note: input.note ?? null,
        createdByUserId: user.id
      })
    );
  }
}

