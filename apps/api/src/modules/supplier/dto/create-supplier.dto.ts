import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateSupplierDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
