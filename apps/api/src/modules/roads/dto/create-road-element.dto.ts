import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoadElementDto {
  @ApiProperty({ description: "e.g. sidewalk, bike_lane, drainage, lighting" })
  @IsString()
  @MinLength(2)
  elementType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fromChainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  toChainage?: number;
}

