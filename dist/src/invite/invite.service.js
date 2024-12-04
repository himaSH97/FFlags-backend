"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
let InviteService = class InviteService {
    create(createInviteDto) {
        return 'This action adds a new invite';
    }
    async findAll(userId) {
        const projectInvites = await db_1.db
            .select()
            .from(schema_1.usersOnProjects)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.usersOnProjects.userId, userId), (0, drizzle_orm_1.eq)(schema_1.usersOnProjects.status, 'pending')))
            .execute();
        return projectInvites;
    }
    findOne(id) {
        return `This action returns a #${id} invite`;
    }
    update(id, updateInviteDto) {
        return `This action updates a #${id} invite`;
    }
    remove(id) {
        return `This action removes a #${id} invite`;
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = __decorate([
    (0, common_1.Injectable)()
], InviteService);
//# sourceMappingURL=invite.service.js.map