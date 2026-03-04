import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, MinLength } from "class-validator";

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ enum: ["ROAD", "BRIDGE", "DRAINAGE", "OTHER"], default: "ROAD" })
  @IsIn(["ROAD", "BRIDGE", "DRAINAGE", "OTHER"])
  projectType!: "ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER";
}

