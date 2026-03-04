import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class LinkAttachmentDto {
  @ApiProperty({ description: "The object key returned by /attachments/presign." })
  @IsString()
  @MinLength(1)
  objectKey!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sizeBytes?: string;

  @ApiProperty({ required: false, description: "e.g. daily_progress, inspection, incident" })
  @IsOptional()
  @IsString()
  linkedEntityType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  linkedEntityId?: string;
}

