import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    const userId = '5f2d381a-1b5c-4bca-b49c-91d4074b050a';
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
  @Get(':id/flags')
  findFlags(
    @Param('id') id: string,
    @Query('s') search: string = '',
    @Query('r') pageSize: number = 10,
    @Query('p') pageNumber: number = 1,
  ) {
    console.log(search, pageSize, pageNumber);
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
