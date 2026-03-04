import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { QaController } from "./qa.controller";
import { QaService } from "./qa.service";
import { ChecklistItem } from "./entities/checklist-item.entity";
import { ChecklistTemplate } from "./entities/checklist-template.entity";
import { Inspection } from "./entities/inspection.entity";
import { ReworkRecord } from "./entities/rework-record.entity";

@Module({
  imports: [AuthModule, RoadsModule, TypeOrmModule.forFeature([ChecklistTemplate, ChecklistItem, Inspection, ReworkRecord])],
  controllers: [QaController],
  providers: [QaService],
  exports: [QaService]
})
export class QaModule {}
