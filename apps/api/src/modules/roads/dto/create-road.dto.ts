import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoadDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: "Unique code within the project." })
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiProperty({ required: false, description: "Free text, e.g. highway, city road." })
  @IsOptional()
  @IsString()
  roadType?: string;
}

