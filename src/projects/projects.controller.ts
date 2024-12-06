import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { ExpressRequestWithAuth } from '@clerk/express';
import { RequestWithAuthSystemInfo } from 'src/types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   *
   * Create a new project
   *
   */

  @Post()
  create(
    @Req() request: RequestWithAuthSystemInfo,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(
      createProjectDto,
      request.systemInfo.userId,
    );
  }

  /**
   *
   * Get all projects
   *
   */

  @Get()
  findAll(@Req() request: RequestWithAuthSystemInfo) {
    return this.projectsService.findAll(request.systemInfo.projects);
  }

  /**
   *
   * Get Feature flags list for a project
   *
   */

  @Get(':id/flags')
  findFlags(
    @Param('id') id: string,
    @Query('search') search: string = '',
    @Query('limit') pageSize: number = 10,
    @Query('page') pageNumber: number = 1,
  ) {
    return this.projectsService.findFlags(id, search, pageSize, pageNumber);
  }

  /**
   *
   * Get Feature flag information for a project and flag id
   *
   */

  @Get(':id/flags/:flagId')
  getFlag(@Param('id') id: string, @Param('flagId') flagId: string) {
    return this.projectsService.getFlagInfo(id, flagId);
  }

  /**
   *
   * Create a feature flag for a project
   *
   */

  @Post(':id/flags')
  createFlags(
    @Param('id') id: string,
    @Body() createFeatureFlagDto: any,
    @Req() request: RequestWithAuthSystemInfo,
  ) {
    return this.projectsService.createFlags(
      id,
      createFeatureFlagDto,
      request.systemInfo.userId,
    );
  }

  /**
   *
   * Get all defined roles for a project
   *
   */

  @Get(':id/roles')
  getProjectRoles(@Param('id') id: string) {
    return this.projectsService.getProjectRoles(id);
  }

  /**
   *
   * Create a new role for a project
   *
   */

  @Post(':id/role')
  createProjectRole(
    @Param('id') id: string,
    @Body() createProjectRoleDto: CreateRoleDto,
  ) {
    return this.projectsService.createProjectRole(id, createProjectRoleDto);
  }

  /**
   *
   * Delete a role for a project
   *
   */

  @Delete(':id/roles/:roleId')
  removeProjectRole(@Param('roleId') roleId: string) {
    return this.projectsService.removeProjectRole(roleId);
  }

  /**
   *
   * Get Proiect keys for a project
   *
   */

  @Get(':id/keys')
  getProjectKeys(
    @Param('id') id: string,
    @Req() request: RequestWithAuthSystemInfo,
  ) {
    return this.projectsService.getProjectKeys(id);
  }
}
