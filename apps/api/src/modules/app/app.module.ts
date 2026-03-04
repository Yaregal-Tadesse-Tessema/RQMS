import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AttachmentsModule } from "../attachments/attachments.module";
import { AuthModule } from "../auth/auth.module";
import { DashboardModule } from "../dashboard/dashboard.module";
import { HealthModule } from "../health/health.module";
import { MachineryModule } from "../machinery/machinery.module";
import { RoadsModule } from "../roads/roads.module";
import { SafetyModule } from "../safety/safety.module";
import { EnvironmentModule } from "../environment/environment.module";
import { GrievanceModule } from "../grievance/grievance.module";
import { QaModule } from "../qa/qa.module";
import { SupplierModule } from "../supplier/supplier.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = "postgres://postgres:esaapp123%21@196.189.124.228:5432/transport_dev";

        const synchronize = (process.env.TYPEORM_SYNCHRONIZE ?? "false") === "true";

        return {
          type: "postgres",
          url,
          autoLoadEntities: true,
          synchronize,
          migrationsRun: false,
          ssl: (process.env.DATABASE_SSL ?? "false") === "true" ? { rejectUnauthorized: false } : false
        };
      }
    }),
    AuthModule,
    HealthModule,
    RoadsModule,
    DashboardModule,
    MachineryModule,
    SafetyModule,
    EnvironmentModule,
    GrievanceModule,
    QaModule,
    SupplierModule,
    AttachmentsModule
  ]
})
export class AppModule {}
