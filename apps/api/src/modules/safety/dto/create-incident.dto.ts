import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateIncidentDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty({ description: "ISO timestamp" })
  @IsDateString()
  occurredAt!: string;

  @ApiProperty({ enum: ["low", "medium", "high"], default: "medium" })
  @IsIn(["low", "medium", "high"])
  severity!: "low" | "medium" | "high";

  @ApiProperty()
  @IsString()
  @MinLength(5)
  description!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

