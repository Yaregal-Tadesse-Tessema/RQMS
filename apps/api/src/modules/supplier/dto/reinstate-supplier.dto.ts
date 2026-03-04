import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ReinstateSupplierDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
