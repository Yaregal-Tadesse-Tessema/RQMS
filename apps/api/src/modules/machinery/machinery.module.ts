import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { FuelIssue } from "./entities/fuel-issue.entity";
import { FuelRequest } from "./entities/fuel-request.entity";
import { Machinery } from "./entities/machinery.entity";
import { MachineryController } from "./machinery.controller";
import { MachineryService } from "./machinery.service";

@Module({
  imports: [AuthModule, RoadsModule, TypeOrmModule.forFeature([Machinery, FuelRequest, FuelIssue])],
  controllers: [MachineryController],
  providers: [MachineryService]
})
export class MachineryModule {}
