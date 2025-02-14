import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithAuthSystemInfo } from 'src/types';
import { permission } from 'process';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('permissions')
  findOne(@Req() request: RequestWithAuthSystemInfo) {
    return { permissions: request.systemInfo.permissions };
  }

  @Get('project-info')
  findRoles(@Req() request: RequestWithAuthSystemInfo) {
    return this.userService.getRoles(request.systemInfo.userId);
  }
}
