import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { DashboardOverviewDto } from "./dto/dashboard-overview.dto";
import { ProjectDashboardDto } from "./dto/project-dashboard.dto";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller("/dashboard")
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @ApiOkResponse({ type: DashboardOverviewDto })
  @Get("/overview")
  overview(@CurrentUser() user: User) {
    return this.dashboard.getOverview(user);
  }

  @ApiOkResponse({ type: ProjectDashboardDto })
  @Get("/projects/:projectId")
  project(@CurrentUser() user: User, @Param("projectId") projectId: string, @Query("workDate") workDate?: string) {
    return this.dashboard.getProjectDashboard(user, projectId, workDate);
  }
}

