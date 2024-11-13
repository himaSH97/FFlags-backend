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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    const userId = 'cffa43b6-a623-489e-86db-7f049f64aed2';
    return this.projectsService.create(createProjectDto, userId);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
