import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { User } from "../auth/entities/user.entity";
import { Attachment } from "./entities/attachment.entity";
import { MinioS3Service } from "./s3/minio-s3.service";

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly s3: MinioS3Service,
    @InjectRepository(Attachment) private readonly repo: Repository<Attachment>
  ) {}

  async presignUpload(input: { fileName?: string; contentType?: string; keyPrefix?: string }) {
    const prefix = input.keyPrefix ? input.keyPrefix.replace(/^\/+|\/+$/g, "") + "/" : "";
    const ext = input.fileName?.includes(".") ? "." + input.fileName.split(".").pop() : "";
    const objectKey = `${prefix}${uuidv4()}${ext ?? ""}`;

    const url = await this.s3.presignPutObject(objectKey, input.contentType);
    return {
      bucket: this.s3.getBucket(),
      objectKey,
      method: "PUT",
      url
    };
  }

  async link(user: User, input: { objectKey: string; contentType?: string; sizeBytes?: string; linkedEntityType?: string; linkedEntityId?: string }) {
    const attachment = this.repo.create({
      bucket: this.s3.getBucket(),
      objectKey: input.objectKey,
      contentType: input.contentType ?? null,
      sizeBytes: input.sizeBytes ?? null,
      linkedEntityType: input.linkedEntityType ?? null,
      linkedEntityId: input.linkedEntityId ?? null,
      uploadedByUserId: user.id
    });
    return await this.repo.save(attachment);
  }

  async getDownloadLink(id: string) {
    const attachment = await this.repo.findOne({ where: { id } });
    if (!attachment) throw new NotFoundException("Attachment not found");
    const url = await this.s3.presignGetObject(attachment.objectKey);
    return { attachment, url };
  }
}

