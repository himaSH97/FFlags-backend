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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Req() request: ExpressRequestWithAuth,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(
      createProjectDto,
      request.auth.userId as string,
    );
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/flags')
  findFlags(
    @Param('id') id: string,
    @Query('search') search: string = '',
    @Query('limit') pageSize: number = 10,
    @Query('page') pageNumber: number = 1,
  ) {
    return this.projectsService.findFlags(id, search, pageSize, pageNumber);
  }

  @Get(':id/flags/:flagId')
  getFlag(@Param('id') id: string, @Param('flagId') flagId: string) {
    return this.projectsService.getFlagInfo(id, flagId);
  }

  @Post(':id/flags')
  createFlags(@Param('id') id: string, @Body() createFeatureFlagDto: any) {
    console.log('hit');
    return this.projectsService.createFlags(id, createFeatureFlagDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Get(':id/roles')
  getProjectRoles(@Param('id') id: string) {
    return this.projectsService.getProjectRoles(id);
  }

  @Post(':id/roles')
  createProjectRole(
    @Param('id') id: string,
    @Body() createProjectRoleDto: CreateRoleDto,
  ) {
    return this.projectsService.createProjectRole(id, createProjectRoleDto);
  }

  @Delete(':id/roles/:roleId')
  removeProjectRole(@Param('roleId') roleId: string) {
    return this.projectsService.removeProjectRole(roleId);
  }
}
