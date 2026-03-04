import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "node:path";

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
      isGlobal: true,
      // Support both local and PM2 deployments where cwd may be repo root or apps/api.
      envFilePath: [
        resolve(process.cwd(), ".env"),
        resolve(process.cwd(), "apps/api/.env"),
        resolve(process.cwd(), "../.env"),
        resolve(process.cwd(), "../../.env"),
        resolve(__dirname, "../../../.env"),
        resolve(__dirname, "../../../../../.env")
      ]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error("DATABASE_URL is required");
        }

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
