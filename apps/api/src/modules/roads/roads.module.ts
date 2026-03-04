import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { ProjectMembership } from "./entities/project-membership.entity";
import { Project } from "./entities/project.entity";
import { Road } from "./entities/road.entity";
import { RoadSection } from "./entities/road-section.entity";
import { ChainageSegment } from "./entities/chainage-segment.entity";
import { RoadElement } from "./entities/road-element.entity";
import { RoadFeature } from "./entities/road-feature.entity";
import { WorkItem } from "./entities/work-item.entity";
import { WorkLayer } from "./entities/work-layer.entity";
import { ActivityType } from "./entities/activity-type.entity";
import { DailyProgress } from "./entities/daily-progress.entity";
import { Inspection } from "../qa/entities/inspection.entity";
import { ReworkRecord } from "../qa/entities/rework-record.entity";
import { RoadsController } from "./roads.controller";
import { RoadsService } from "./roads.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Project,
      ProjectMembership,
      Road,
      RoadSection,
      ChainageSegment,
      RoadElement,
      RoadFeature,
      WorkItem,
      WorkLayer,
      ActivityType,
      DailyProgress,
      Inspection,
      ReworkRecord
    ])
  ],
  controllers: [RoadsController],
  providers: [RoadsService],
  exports: [RoadsService]
})
export class RoadsModule {}
