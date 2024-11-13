import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { LegacyRequireAuthMiddleware } from './required-auth.middleware';

@Module({
  imports: [ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
