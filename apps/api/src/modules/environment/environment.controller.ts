import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { CreateEnvironmentalRecordDto } from "./dto/create-environmental-record.dto";
import { EnvironmentService } from "./environment.service";

@ApiTags("environment")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class EnvironmentController {
  constructor(private readonly svc: EnvironmentService) {}

  @Post("/environment/records")
  createRecord(@CurrentUser() user: User, @Body() dto: CreateEnvironmentalRecordDto) {
    return this.svc.createRecord(user, {
      projectId: dto.projectId,
      capturedAt: new Date(dto.capturedAt),
      parameter: dto.parameter,
      value: dto.value,
      unit: dto.unit,
      notes: dto.notes
    });
  }

  @Get("/environment/records/:projectId")
  list(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.svc.listRecords(user, projectId);
  }
}

