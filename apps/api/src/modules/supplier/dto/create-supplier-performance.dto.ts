import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateSupplierPerformanceDto {
  @ApiProperty({ description: "YYYY-MM-DD" })
  @IsDateString()
  evaluationDate!: string;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  qualityScore!: number;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  complianceScore!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
