import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class AddGrievanceActionDto {
  @ApiProperty()
  @IsUUID()
  grievanceId!: string;

  @ApiProperty({ description: "note, assign, close, escalate..." })
  @IsString()
  @MinLength(2)
  actionType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

