import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { FuelIssue } from "./entities/fuel-issue.entity";
import { FuelRequest } from "./entities/fuel-request.entity";
import { Machinery } from "./entities/machinery.entity";

@Injectable()
export class MachineryService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(Machinery) private readonly machinery: Repository<Machinery>,
    @InjectRepository(FuelRequest) private readonly fuelRequests: Repository<FuelRequest>,
    @InjectRepository(FuelIssue) private readonly fuelIssues: Repository<FuelIssue>
  ) {}

  async createMachinery(input: Pick<Machinery, "name" | "category" | "plateOrSerial">) {
    return await this.machinery.save(
      this.machinery.create({
        name: input.name,
        category: input.category ?? null,
        plateOrSerial: input.plateOrSerial ?? null,
        status: "active"
      })
    );
  }

  async listMachinery() {
    return await this.machinery.find({ order: { createdAt: "DESC" } });
  }

  async requestFuel(user: User, input: { projectId: string; machineryId: string; requestedLiters: number }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    const m = await this.machinery.findOne({ where: { id: input.machineryId } });
    if (!m) throw new NotFoundException("Machinery not found");
    return await this.fuelRequests.save(
      this.fuelRequests.create({
        projectId: input.projectId,
        machineryId: input.machineryId,
        requestedLiters: input.requestedLiters,
        status: "requested",
        requestedByUserId: user.id,
        approvedByUserId: null,
        approvedAt: null,
        approvalNote: null
      })
    );
  }

  async approveRequest(user: User, requestId: string, note?: string) {
    const req = await this.fuelRequests.findOne({ where: { id: requestId } });
    if (!req) throw new NotFoundException("Fuel request not found");
    await this.roads.ensureProjectMember(req.projectId, user);
    if (req.status !== "requested") throw new BadRequestException("Fuel request is not pending");
    req.status = "approved";
    req.approvedByUserId = user.id;
    req.approvedAt = new Date();
    req.approvalNote = note ?? null;
    return await this.fuelRequests.save(req);
  }

  async issueFuel(user: User, input: { projectId: string; machineryId: string; fuelRequestId?: string; issuedLiters: number }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    const m = await this.machinery.findOne({ where: { id: input.machineryId } });
    if (!m) throw new NotFoundException("Machinery not found");

    let fuelRequest: FuelRequest | null = null;
    if (input.fuelRequestId) {
      fuelRequest = await this.fuelRequests.findOne({ where: { id: input.fuelRequestId } });
      if (!fuelRequest) throw new NotFoundException("Fuel request not found");
      if (fuelRequest.projectId !== input.projectId) throw new BadRequestException("Fuel request project mismatch");
      if (fuelRequest.status !== "approved") throw new BadRequestException("Fuel request must be approved before issue");
      fuelRequest.status = "issued";
      await this.fuelRequests.save(fuelRequest);
    }

    return await this.fuelIssues.save(
      this.fuelIssues.create({
        projectId: input.projectId,
        machineryId: input.machineryId,
        fuelRequestId: input.fuelRequestId ?? null,
        issuedLiters: input.issuedLiters,
        issuedByUserId: user.id
      })
    );
  }
}

