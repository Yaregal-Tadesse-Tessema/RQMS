import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { RoadsModule } from "../roads/roads.module";
import { MaterialSource } from "./entities/material-source.entity";
import { SupplierDocument } from "./entities/supplier-document.entity";
import { SupplierPerformance } from "./entities/supplier-performance.entity";
import { Supplier } from "./entities/supplier.entity";
import { SupplierController } from "./supplier.controller";
import { SupplierService } from "./supplier.service";

@Module({
  imports: [
    AuthModule,
    RoadsModule,
    TypeOrmModule.forFeature([Supplier, SupplierDocument, MaterialSource, SupplierPerformance])
  ],
  controllers: [SupplierController],
  providers: [SupplierService]
})
export class SupplierModule {}
