import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { EnvironmentController } from "./environment.controller";
import { EnvironmentService } from "./environment.service";
import { EnvironmentalRecord } from "./entities/environmental-record.entity";

@Module({
  imports: [AuthModule, RoadsModule, TypeOrmModule.forFeature([EnvironmentalRecord])],
  controllers: [EnvironmentController],
  providers: [EnvironmentService]
})
export class EnvironmentModule {}
