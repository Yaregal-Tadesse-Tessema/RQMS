import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInspectionDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsUUID()
  workItemId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  checklistTemplateId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fromChainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  toChainage?: number;

  @ApiProperty({ enum: ["pass", "conditional", "fail"], default: "pass" })
  @IsIn(["pass", "conditional", "fail"])
  outcome!: "pass" | "conditional" | "fail";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: "ISO timestamp" })
  @IsDateString()
  inspectedAt!: string;
}

