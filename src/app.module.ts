import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { LegacyRequireAuthMiddleware } from './middlewares/auth.middleware';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AuditModule } from './audit/audit.module';
import { FlagValuesModule } from './flag-values/flag-values.module';
import { SystemRequiredMiddleware } from './middlewares/system-required.middleware';
import { MemberModule } from './member/member.module';
import { ClientModule } from './client/client.module';
import { InviteModule } from './invite/invite.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ProjectsModule,
    AuditModule,
    FlagValuesModule,
    MemberModule,
    ClientModule,
    InviteModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer
      .apply(LegacyRequireAuthMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'client/flag-info', method: RequestMethod.ALL },
      )
      .forRoutes('*');
    consumer
      .apply(SystemRequiredMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'client/flag-info', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
