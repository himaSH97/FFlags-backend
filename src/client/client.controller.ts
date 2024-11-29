import { ClientService, FlagInfoRequest } from './client.service';
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

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('encrypt/:projectId')
  async encryptContent(
    @Param('projectId') projectId: string,
    @Body() jsonData: any,
  ) {
    return this.clientService.encryptContent(projectId, jsonData);
  }

  @Post('decrypt/:projectId')
  async decryptContent(
    @Param('projectId') projectId: string,
    @Body('encryptedContent') encryptedContent: string,
    @Body('signature') signature: string,
  ) {
    return this.clientService.decryptContent(
      projectId,
      encryptedContent,
      signature,
    );
  }
  @Get('flags')
  getFlag(@Body() body: FlagInfoRequest) {
    return this.clientService.getFlagsInfo(body);
  }
}
