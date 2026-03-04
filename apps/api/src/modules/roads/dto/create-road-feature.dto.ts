import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoadFeatureDto {
  @ApiProperty({ description: "e.g. inlet, sign, crossing, pole" })
  @IsString()
  @MinLength(2)
  featureType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  chainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

