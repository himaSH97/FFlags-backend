import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { LegacyRequireAuthMiddleware } from './middlewares/auth.middleware';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AuditModule } from './audit/audit.module';
import { FlagValuesModule } from './flag-values/flag-values.module';
import { SystemRequiredMiddleware } from './middlewares/system-required.middleware';

@Module({
  imports: [ProjectsModule, AuditModule, FlagValuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(LegacyRequireAuthMiddleware).forRoutes('*');
    consumer.apply(SystemRequiredMiddleware).forRoutes('*');
  }
}
