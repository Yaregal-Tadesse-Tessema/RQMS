import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ApproveFuelRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

