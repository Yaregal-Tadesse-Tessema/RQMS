import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateFuelIssueDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsUUID()
  machineryId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  fuelRequestId?: string;

  @ApiProperty()
  @IsNumber()
  issuedLiters!: number;
}

