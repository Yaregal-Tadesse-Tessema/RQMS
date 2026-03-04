import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { CloseReworkDto } from "./dto/close-rework.dto";
import { CreateChecklistTemplateDto } from "./dto/create-checklist-template.dto";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { QaService } from "./qa.service";

@ApiTags("qa")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class QaController {
  constructor(private readonly svc: QaService) {}

  @Post("/checklists/templates")
  createTemplate(@CurrentUser() user: User, @Body() dto: CreateChecklistTemplateDto) {
    return this.svc.createTemplate(user, dto);
  }

  @Post("/inspections")
  createInspection(@CurrentUser() user: User, @Body() dto: CreateInspectionDto) {
    return this.svc.createInspection(user, {
      projectId: dto.projectId,
      workItemId: dto.workItemId,
      checklistTemplateId: dto.checklistTemplateId,
      fromChainage: dto.fromChainage,
      toChainage: dto.toChainage,
      outcome: dto.outcome,
      notes: dto.notes,
      inspectedAt: new Date(dto.inspectedAt)
    });
  }

  @Post("/rework/close")
  closeRework(@CurrentUser() user: User, @Body() dto: CloseReworkDto) {
    return this.svc.closeRework(user, dto);
  }
}

