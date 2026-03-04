import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { AddGrievanceActionDto } from "./dto/add-grievance-action.dto";
import { CreateGrievanceDto } from "./dto/create-grievance.dto";
import { GrievanceService } from "./grievance.service";

@ApiTags("grievance")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class GrievanceController {
  constructor(private readonly svc: GrievanceService) {}

  @Post("/grievances")
  create(@CurrentUser() user: User, @Body() dto: CreateGrievanceDto) {
    return this.svc.create(user, dto);
  }

  @Get("/grievances/:projectId")
  list(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.svc.list(user, projectId);
  }

  @Post("/grievances/actions")
  addAction(@CurrentUser() user: User, @Body() dto: AddGrievanceActionDto) {
    return this.svc.addAction(user, dto);
  }
}

