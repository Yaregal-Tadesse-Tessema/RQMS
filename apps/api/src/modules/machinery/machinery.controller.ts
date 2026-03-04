import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { ApproveFuelRequestDto } from "./dto/approve-fuel-request.dto";
import { CreateFuelIssueDto } from "./dto/create-fuel-issue.dto";
import { CreateFuelRequestDto } from "./dto/create-fuel-request.dto";
import { CreateMachineryDto } from "./dto/create-machinery.dto";
import { MachineryService } from "./machinery.service";

@ApiTags("machinery")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class MachineryController {
  constructor(private readonly svc: MachineryService) {}

  @Post("/machinery")
  createMachinery(@Body() dto: CreateMachineryDto) {
    return this.svc.createMachinery({ name: dto.name, category: dto.category ?? null, plateOrSerial: dto.plateOrSerial ?? null });
  }

  @Get("/machinery")
  listMachinery() {
    return this.svc.listMachinery();
  }

  @Post("/fuel/requests")
  requestFuel(@CurrentUser() user: User, @Body() dto: CreateFuelRequestDto) {
    return this.svc.requestFuel(user, dto);
  }

  @Post("/fuel/requests/:id/approve")
  approve(@CurrentUser() user: User, @Param("id") id: string, @Body() dto: ApproveFuelRequestDto) {
    return this.svc.approveRequest(user, id, dto.note);
  }

  @Post("/fuel/issues")
  issue(@CurrentUser() user: User, @Body() dto: CreateFuelIssueDto) {
    return this.svc.issueFuel(user, dto);
  }
}

