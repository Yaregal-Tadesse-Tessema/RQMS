import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";

export class CreateSupplierDocumentDto {
  @ApiProperty({ enum: ["LICENSE", "CERTIFICATION", "APPROVAL", "OTHER"] })
  @IsIn(["LICENSE", "CERTIFICATION", "APPROVAL", "OTHER"])
  documentType!: "LICENSE" | "CERTIFICATION" | "APPROVAL" | "OTHER";

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issuingAuthority?: string;

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
  @IsString()
  notes?: string;
}
