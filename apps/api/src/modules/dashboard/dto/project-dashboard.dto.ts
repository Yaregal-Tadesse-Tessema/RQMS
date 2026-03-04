import { ApiProperty } from "@nestjs/swagger";

class DashboardCountsDto {
  @ApiProperty()
  roads!: number;

  @ApiProperty()
  sections!: number;

  @ApiProperty()
  workItems!: number;

  @ApiProperty({ description: "Number of daily progress entries on workDate." })
  progressEntriesOnDate!: number;

  @ApiProperty({ description: "Sum(quantity) of daily progress entries on workDate." })
  progressQuantityOnDate!: number;

  @ApiProperty({ description: "Open rework records linked to failed inspections." })
  openFailedReworks!: number;

  @ApiProperty()
  fuelRequestsRequested!: number;

  @ApiProperty()
  fuelRequestsApproved!: number;

  @ApiProperty()
  fuelIssues!: number;

  @ApiProperty()
  safetyInspections!: number;

  @ApiProperty()
  incidents!: number;

  @ApiProperty()
  environmentalRecords!: number;

  @ApiProperty()
  grievancesOpen!: number;

  @ApiProperty()
  grievancesTotal!: number;
}

class DashboardIncidentLiteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: "ISO timestamp" })
  occurredAt!: string;

  @ApiProperty({ enum: ["low", "medium", "high"] })
  severity!: "low" | "medium" | "high";

  @ApiProperty()
  description!: string;
}

class DashboardGrievanceLiteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  status!: "open" | "in_progress" | "closed";

  @ApiProperty()
  description!: string;

  @ApiProperty({ description: "ISO timestamp" })
  createdAt!: string;
}

class DashboardEnvironmentalLiteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  parameter!: string;

  @ApiProperty({ required: false, nullable: true })
  value!: number | null;

  @ApiProperty({ required: false, nullable: true })
  unit!: string | null;

  @ApiProperty({ description: "ISO timestamp" })
  capturedAt!: string;
}

class DashboardFuelRequestLiteDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  status!: "requested" | "approved" | "rejected" | "issued";

  @ApiProperty()
  requestedLiters!: number;

  @ApiProperty({ description: "ISO timestamp" })
  createdAt!: string;
}

export class ProjectDashboardDto {
  @ApiProperty()
  projectId!: string;

  @ApiProperty({ description: "YYYY-MM-DD" })
  workDate!: string;

  @ApiProperty({ type: DashboardCountsDto })
  counts!: DashboardCountsDto;

  @ApiProperty({ type: [DashboardFuelRequestLiteDto] })
  recentFuelRequests!: DashboardFuelRequestLiteDto[];

  @ApiProperty({ type: [DashboardIncidentLiteDto] })
  recentIncidents!: DashboardIncidentLiteDto[];

  @ApiProperty({ type: [DashboardEnvironmentalLiteDto] })
  recentEnvironmentalRecords!: DashboardEnvironmentalLiteDto[];

  @ApiProperty({ type: [DashboardGrievanceLiteDto] })
  recentGrievances!: DashboardGrievanceLiteDto[];
}

