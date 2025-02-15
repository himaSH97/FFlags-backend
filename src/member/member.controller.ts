import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { RequestWithAuthSystemInfo } from 'src/types';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post(':projectId')
  create(
    @Req() request: RequestWithAuthSystemInfo,
    @Param('projectId') projectId: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.memberService.create(createMemberDto, projectId, request.systemInfo.userId);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get('all/:projectId')
  getAllMembersPerProject(
    @Param('projectId') projectId: string,
    @Query('search') search: string = '',
    @Query('limit') pageSize: number = 10,
    @Query('page') pageNumber: number = 1,
    @Query('role') role: string = '',
  ) {
    const rolesArray = role ? role.split('.') : [];
    return this.memberService.getAllMembersPerProject(projectId, search, rolesArray, pageSize, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithAuthSystemInfo) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: any) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
