import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { EnvironmentModule } from "../environment/environment.module";
import { EnvironmentalRecord } from "../environment/entities/environmental-record.entity";
import { Grievance } from "../grievance/entities/grievance.entity";
import { GrievanceModule } from "../grievance/grievance.module";
import { FuelIssue } from "../machinery/entities/fuel-issue.entity";
import { FuelRequest } from "../machinery/entities/fuel-request.entity";
import { MachineryModule } from "../machinery/machinery.module";
import { Inspection } from "../qa/entities/inspection.entity";
import { ReworkRecord } from "../qa/entities/rework-record.entity";
import { QaModule } from "../qa/qa.module";
import { Project } from "../roads/entities/project.entity";
import { DailyProgress } from "../roads/entities/daily-progress.entity";
import { Road } from "../roads/entities/road.entity";
import { RoadSection } from "../roads/entities/road-section.entity";
import { WorkItem } from "../roads/entities/work-item.entity";
import { RoadsModule } from "../roads/roads.module";
import { Incident } from "../safety/entities/incident.entity";
import { SafetyInspection } from "../safety/entities/safety-inspection.entity";
import { SafetyModule } from "../safety/safety.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [
    AuthModule,
    RoadsModule,
    MachineryModule,
    SafetyModule,
    EnvironmentModule,
    GrievanceModule,
    QaModule,
    TypeOrmModule.forFeature([
      Project,
      Road,
      RoadSection,
      WorkItem,
      DailyProgress,
      Inspection,
      ReworkRecord,
      FuelRequest,
      FuelIssue,
      SafetyInspection,
      Incident,
      EnvironmentalRecord,
      Grievance
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}

