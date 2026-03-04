import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateGrievanceDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complainantName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complainantContact?: string;
}

