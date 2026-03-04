import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { ChecklistItem } from "./entities/checklist-item.entity";
import { ChecklistTemplate } from "./entities/checklist-template.entity";
import { Inspection } from "./entities/inspection.entity";
import { ReworkRecord } from "./entities/rework-record.entity";

@Injectable()
export class QaService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(ChecklistTemplate) private readonly templates: Repository<ChecklistTemplate>,
    @InjectRepository(ChecklistItem) private readonly items: Repository<ChecklistItem>,
    @InjectRepository(Inspection) private readonly inspections: Repository<Inspection>,
    @InjectRepository(ReworkRecord) private readonly reworks: Repository<ReworkRecord>
  ) {}

  async createTemplate(user: User, input: { projectId: string; name: string; items: string[] }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    const template = await this.templates.save(this.templates.create({ projectId: input.projectId, name: input.name }));
    await this.items.save(input.items.map((text) => this.items.create({ templateId: template.id, text })));
    return await this.templates.findOne({ where: { id: template.id }, relations: { items: true } });
  }

  async createInspection(user: User, input: { projectId: string; workItemId: string; checklistTemplateId?: string; fromChainage?: number; toChainage?: number; outcome: "pass" | "conditional" | "fail"; notes?: string; inspectedAt: Date }) {
    await this.roads.ensureProjectMember(input.projectId, user);
    const inspection = await this.inspections.save(
      this.inspections.create({
        projectId: input.projectId,
        workItemId: input.workItemId,
        checklistTemplateId: input.checklistTemplateId ?? null,
        fromChainage: input.fromChainage ?? null,
        toChainage: input.toChainage ?? null,
        outcome: input.outcome,
        notes: input.notes ?? null,
        inspectedByUserId: user.id,
        inspectedAt: input.inspectedAt
      })
    );

    if (inspection.outcome === "fail") {
      await this.reworks.save(
        this.reworks.create({
          inspectionId: inspection.id,
          status: "open",
          note: "Rework required",
          createdByUserId: user.id
        })
      );
    }

    return inspection;
  }

  async closeRework(user: User, input: { inspectionId: string; note?: string }) {
    const inspection = await this.inspections.findOne({ where: { id: input.inspectionId } });
    if (!inspection) throw new NotFoundException("Inspection not found");
    await this.roads.ensureProjectMember(inspection.projectId, user);

    const rework = await this.reworks.findOne({ where: { inspectionId: inspection.id, status: "open" } });
    if (!rework) return { ok: true, message: "No open rework" };

    rework.status = "closed";
    rework.note = input.note ?? rework.note;
    await this.reworks.save(rework);
    return { ok: true };
  }

  async hasBlockingFailure(workItemId: string, fromChainage: number | null, toChainage: number | null): Promise<boolean> {
    const openReworks = await this.reworks
      .createQueryBuilder("r")
      .innerJoin(Inspection, "i", "i.id = r.inspectionId")
      .where("i.workItemId = :workItemId", { workItemId })
      .andWhere("i.outcome = 'fail'")
      .andWhere("r.status = 'open'")
      .getRawMany();

    if (openReworks.length === 0) return false;

    // Minimal gating: if no chainage range provided, block.
    if (fromChainage == null || toChainage == null) return true;

    // If there is any failed inspection with overlapping range, block.
    const failedInspections = await this.inspections.find({ where: { workItemId, outcome: "fail" } });
    return failedInspections.some((i) => {
      const a1 = i.fromChainage ?? Number.NEGATIVE_INFINITY;
      const a2 = i.toChainage ?? Number.POSITIVE_INFINITY;
      const b1 = fromChainage;
      const b2 = toChainage;
      return Math.max(a1, b1) <= Math.min(a2, b2);
    });
  }
}

