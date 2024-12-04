"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const projects_module_1 = require("./projects/projects.module");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const request_logger_middleware_1 = require("./middlewares/request-logger.middleware");
const audit_module_1 = require("./audit/audit.module");
const flag_values_module_1 = require("./flag-values/flag-values.module");
const system_required_middleware_1 = require("./middlewares/system-required.middleware");
const member_module_1 = require("./member/member.module");
const client_module_1 = require("./client/client.module");
const invite_module_1 = require("./invite/invite.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
        consumer
            .apply(auth_middleware_1.LegacyRequireAuthMiddleware)
            .exclude({ path: 'client', method: common_1.RequestMethod.ALL })
            .forRoutes('*');
        consumer
            .apply(system_required_middleware_1.SystemRequiredMiddleware)
            .exclude({ path: 'client', method: common_1.RequestMethod.ALL })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            projects_module_1.ProjectsModule,
            audit_module_1.AuditModule,
            flag_values_module_1.FlagValuesModule,
            member_module_1.MemberModule,
            client_module_1.ClientModule,
            invite_module_1.InviteModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map