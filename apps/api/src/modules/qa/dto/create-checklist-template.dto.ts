import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString, IsUUID, MinLength } from "class-validator";

export class CreateChecklistTemplateDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  items!: string[];
}

