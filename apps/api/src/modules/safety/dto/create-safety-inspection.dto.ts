import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateSafetyInspectionDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty({ description: "YYYY-MM-DD" })
  @IsDateString()
  inspectionDate!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

