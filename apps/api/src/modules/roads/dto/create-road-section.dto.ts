import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoadSectionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  startChainage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  endChainage?: number;
}

