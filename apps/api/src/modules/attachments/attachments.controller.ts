import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { LinkAttachmentDto } from "./dto/link-attachment.dto";
import { PresignUploadDto } from "./dto/presign-upload.dto";
import { AttachmentsService } from "./attachments.service";

@ApiTags("attachments")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller("/attachments")
export class AttachmentsController {
  constructor(private readonly attachments: AttachmentsService) {}

  @Post("/presign")
  presign(@Body() dto: PresignUploadDto) {
    return this.attachments.presignUpload(dto);
  }

  @Post("/link")
  link(@CurrentUser() user: User, @Body() dto: LinkAttachmentDto) {
    return this.attachments.link(user, dto);
  }

  @Get("/:id")
  download(@Param("id") id: string) {
    return this.attachments.getDownloadLink(id);
  }
}

