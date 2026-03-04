import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class PresignUploadDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiProperty({ required: false, description: "Optional key prefix, e.g. 'progress/'" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  keyPrefix?: string;
}

