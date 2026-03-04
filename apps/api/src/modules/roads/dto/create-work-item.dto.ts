import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateWorkItemDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: "Unit of measure, e.g. m, m2, m3, ton, item" })
  @IsString()
  @MinLength(1)
  unit!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  roadElementId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  roadFeatureId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  workLayerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  activityTypeId?: string;
}

