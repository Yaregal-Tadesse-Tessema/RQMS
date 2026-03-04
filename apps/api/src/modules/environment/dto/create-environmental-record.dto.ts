import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateEnvironmentalRecordDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty({ description: "ISO timestamp" })
  @IsDateString()
  capturedAt!: string;

  @ApiProperty({ description: "e.g. dust, noise, waste" })
  @IsString()
  @MinLength(2)
  parameter!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

