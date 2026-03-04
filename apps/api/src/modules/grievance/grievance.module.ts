import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { GrievanceController } from "./grievance.controller";
import { GrievanceService } from "./grievance.service";
import { GrievanceAction } from "./entities/grievance-action.entity";
import { Grievance } from "./entities/grievance.entity";

@Module({
  imports: [AuthModule, RoadsModule, TypeOrmModule.forFeature([Grievance, GrievanceAction])],
  controllers: [GrievanceController],
  providers: [GrievanceService]
})
export class GrievanceModule {}
