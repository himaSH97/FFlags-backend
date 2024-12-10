import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { RequestWithAuthSystemInfo } from 'src/types';
import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get()
  findAll(@Req() request: RequestWithAuthSystemInfo) {
    return this.inviteService.findAll(request.systemInfo.userId);
  }

  @Patch('respond')
  inviteResponse(@Body() inviteResponseDto: any) {
    return this.inviteService.inviteResponse(inviteResponseDto);
  }

  @Get('count')
  inviteCount(@Req() request: RequestWithAuthSystemInfo) {
    return this.inviteService.inviteCount(request.systemInfo.userId);
  }
}
