import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateSupplierStatusDto {
  @ApiProperty({ enum: ["suspended", "blacklisted"] })
  @IsIn(["suspended", "blacklisted"])
  status!: "suspended" | "blacklisted";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
