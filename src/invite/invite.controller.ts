import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { RequestWithAuthSystemInfo } from 'src/types';

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
}
