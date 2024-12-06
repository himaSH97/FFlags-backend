"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemRequiredMiddleware = void 0;
const common_1 = require("@nestjs/common");
require("dotenv/config");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const permissions_1 = require("../permissions");
let SystemRequiredMiddleware = class SystemRequiredMiddleware {
    async use(req, res, next) {
        if (!req.auth.sub) {
            return next(new common_1.UnauthorizedException());
        }
        console.log('req.auth.sub', req.auth.sub);
        const user = await db_1.db
            .select({ id: schema_1.users.id, clerkUserId: schema_1.users.clerkUserId })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.clerkUserId, req.auth.sub))
            .execute();
        const systemUserId = user[0].id;
        const systemUserClerkId = user[0].clerkUserId;
        if (!systemUserId && !systemUserClerkId) {
            return next(new common_1.UnauthorizedException('Valid system User not found'));
        }
        const projectList = await db_1.db
            .select({
            projectId: schema_1.usersOnProjects.projectId,
            role: schema_1.usersOnProjects.role,
        })
            .from(schema_1.usersOnProjects)
            .where((0, drizzle_orm_1.eq)(schema_1.usersOnProjects.userId, systemUserId))
            .execute();
        const accessAllowed = projectList.map((project) => project.projectId);
        const systemPermissions = {};
        accessAllowed.forEach((projectId) => {
            const project = projectList.find((project) => project.projectId === projectId);
            if (!project)
                return;
            systemPermissions[project.projectId] = permissions_1.FFPermissions[project.role];
        });
        const systemRequired = {
            projects: accessAllowed,
            userId: user[0].id,
            clerkUserId: user[0].clerkUserId,
            systemPermissions,
        };
        req.systemInfo = systemRequired;
        next();
    }
};
exports.SystemRequiredMiddleware = SystemRequiredMiddleware;
exports.SystemRequiredMiddleware = SystemRequiredMiddleware = __decorate([
    (0, common_1.Injectable)()
], SystemRequiredMiddleware);
//# sourceMappingURL=system-required.middleware.js.map