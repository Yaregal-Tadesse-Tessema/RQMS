import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { Attachment } from "./entities/attachment.entity";
import { AttachmentsController } from "./attachments.controller";
import { AttachmentsService } from "./attachments.service";
import { MinioS3Service } from "./s3/minio-s3.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Attachment])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, MinioS3Service],
  exports: [AttachmentsService]
})
export class AttachmentsModule {}
