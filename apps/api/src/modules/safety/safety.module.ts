import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { Incident } from "./entities/incident.entity";
import { SafetyInspection } from "./entities/safety-inspection.entity";
import { SafetyController } from "./safety.controller";
import { SafetyService } from "./safety.service";

@Module({
  imports: [AuthModule, RoadsModule, TypeOrmModule.forFeature([SafetyInspection, Incident])],
  controllers: [SafetyController],
  providers: [SafetyService]
})
export class SafetyModule {}
