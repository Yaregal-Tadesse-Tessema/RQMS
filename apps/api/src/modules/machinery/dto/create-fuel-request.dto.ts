import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class CreateFuelRequestDto {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsUUID()
  machineryId!: string;

  @ApiProperty()
  @IsNumber()
  requestedLiters!: number;
}

