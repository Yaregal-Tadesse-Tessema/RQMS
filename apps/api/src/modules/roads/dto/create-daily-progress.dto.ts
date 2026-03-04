import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDailyProgressDto {
  @ApiProperty()
  @IsUUID()
  workItemId!: string;

  @ApiProperty({ description: "YYYY-MM-DD" })
  @IsDateString()
  workDate!: string;

  @ApiProperty()
  @IsNumber()
  quantity!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fromChainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  toChainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  weather?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

