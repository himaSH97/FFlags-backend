import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import * as forge from 'node-forge';
import { ClientService, FlagInfoRequest } from './client.service';
import { GetFlagDto } from './dto/get-flag.dto';

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
  @Post('flags')
  getFlagq(@Body() body: GetFlagDto, @Req() req: any) {
    const projectIdBase64 = req.headers['x-fflags-project-key'];

    if (!projectIdBase64) {
      throw new Error('Project key is missing');
    }

    const projectId = forge.util.decode64(projectIdBase64);
    return this.clientService.getFlagsInfo(projectId, {
      ec: body.data.ec,
      s: body.data.s,
    });
  }

  @Post('flag')
  getFlag(@Body() body: GetFlagDto, @Req() req: any) {
    const projectIdBase64 = req.headers['x-fflags-project-key'];

    if (!projectIdBase64) {
      throw new Error('Project key is missing');
    }

    const projectId = forge.util.decode64(projectIdBase64);

    return this.clientService.getFlagInfo(projectId, body);
  }

  @Post('flag-info')
  flagInfo(@Body() body: any, @Req() req: any) {
    const projectIdBase64 = req.headers['x-fflags-project-key'];
    const projectId = forge.util.decode64(projectIdBase64);

    const decrypted = this.clientService.getFlagsInfoV2(projectId, body);

    return decrypted;
  }
}
