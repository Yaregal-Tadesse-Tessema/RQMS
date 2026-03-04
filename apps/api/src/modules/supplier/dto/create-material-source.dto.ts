import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";

export class CreateMaterialSourceDto {
  @ApiProperty({ enum: ["QUARRY", "REFINERY", "CEMENT_PLANT", "OTHER"] })
  @IsIn(["QUARRY", "REFINERY", "CEMENT_PLANT", "OTHER"])
  sourceType!: "QUARRY" | "REFINERY" | "CEMENT_PLANT" | "OTHER";

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  materialType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ required: false, description: "YYYY-MM-DD" })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiProperty({ required: false, description: "YYYY-MM-DD" })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: "active" | "inactive";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
