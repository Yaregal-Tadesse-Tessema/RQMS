import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { User } from "../auth/entities/user.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { CreateRoadDto } from "./dto/create-road.dto";
import { CreateRoadElementDto } from "./dto/create-road-element.dto";
import { CreateRoadFeatureDto } from "./dto/create-road-feature.dto";
import { CreateRoadSectionDto } from "./dto/create-road-section.dto";
import { CreateWorkItemDto } from "./dto/create-work-item.dto";
import { CreateDailyProgressDto } from "./dto/create-daily-progress.dto";
import { RoadsService } from "./roads.service";

@ApiTags("roads")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class RoadsController {
  constructor(private readonly roads: RoadsService) {}

  @Post("/projects")
  createProject(@CurrentUser() user: User, @Body() dto: CreateProjectDto) {
    return this.roads.createProject(user, dto);
  }

  @Get("/projects")
  listProjects(@CurrentUser() user: User) {
    return this.roads.listProjectsForUser(user);
  }

  @Post("/projects/:projectId/roads")
  createRoad(@CurrentUser() user: User, @Param("projectId") projectId: string, @Body() dto: CreateRoadDto) {
    return this.roads.createRoad(projectId, user, { ...dto, roadType: dto.roadType ?? null });
  }

  @Get("/projects/:projectId/roads")
  listRoads(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.roads.listRoads(projectId, user);
  }

  @Post("/roads/:roadId/sections")
  createSection(@CurrentUser() user: User, @Param("roadId") roadId: string, @Body() dto: CreateRoadSectionDto) {
    return this.roads.createSection(roadId, user, dto);
  }

  @Get("/roads/:roadId/sections")
  listSections(@CurrentUser() user: User, @Param("roadId") roadId: string) {
    return this.roads.listSections(roadId, user);
  }

  @Post("/sections/:sectionId/elements")
  addElement(@CurrentUser() user: User, @Param("sectionId") sectionId: string, @Body() dto: CreateRoadElementDto) {
    return this.roads.addElement(sectionId, user, dto);
  }

  @Post("/sections/:sectionId/features")
  addFeature(@CurrentUser() user: User, @Param("sectionId") sectionId: string, @Body() dto: CreateRoadFeatureDto) {
    return this.roads.addFeature(sectionId, user, dto);
  }

  @Post("/sections/:sectionId/work-items")
  createWorkItem(@CurrentUser() user: User, @Param("sectionId") sectionId: string, @Body() dto: CreateWorkItemDto) {
    return this.roads.createWorkItem(sectionId, user, dto);
  }

  @Get("/sections/:sectionId/work-items")
  listWorkItems(@CurrentUser() user: User, @Param("sectionId") sectionId: string) {
    return this.roads.listWorkItems(sectionId, user);
  }

  @Post("/progress")
  addProgress(@CurrentUser() user: User, @Body() dto: CreateDailyProgressDto) {
    return this.roads.addProgress(user, {
      workItemId: dto.workItemId,
      workDate: dto.workDate,
      quantity: dto.quantity,
      fromChainage: dto.fromChainage ?? null,
      toChainage: dto.toChainage ?? null,
      lat: dto.lat ?? null,
      lng: dto.lng ?? null,
      weather: dto.weather ?? null,
      notes: dto.notes ?? null
    });
  }
}
