import { ApiProperty } from "@nestjs/swagger";

class DashboardProjectLiteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ["ROAD", "BRIDGE", "DRAINAGE", "OTHER"] })
  projectType!: "ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER";

  @ApiProperty({ description: "ISO timestamp" })
  createdAt!: string;
}

export class DashboardOverviewDto {
  @ApiProperty()
  projectsCount!: number;

  @ApiProperty({ type: [DashboardProjectLiteDto] })
  recentProjects!: DashboardProjectLiteDto[];
}

