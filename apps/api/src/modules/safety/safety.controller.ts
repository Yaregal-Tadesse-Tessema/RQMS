import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { CreateSafetyInspectionDto } from "./dto/create-safety-inspection.dto";
import { SafetyService } from "./safety.service";

@ApiTags("safety")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class SafetyController {
  constructor(private readonly svc: SafetyService) {}

  @Post("/safety/inspections")
  createInspection(@CurrentUser() user: User, @Body() dto: CreateSafetyInspectionDto) {
    return this.svc.createInspection(user, dto);
  }

  @Get("/safety/inspections/:projectId")
  listInspections(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.svc.listInspections(user, projectId);
  }

  @Post("/incidents")
  createIncident(@CurrentUser() user: User, @Body() dto: CreateIncidentDto) {
    return this.svc.createIncident(user, {
      projectId: dto.projectId,
      occurredAt: new Date(dto.occurredAt),
      severity: dto.severity,
      description: dto.description,
      lat: dto.lat,
      lng: dto.lng
    });
  }

  @Get("/incidents/:projectId")
  listIncidents(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.svc.listIncidents(user, projectId);
  }
}

