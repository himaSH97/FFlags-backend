"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../db/schema");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
let MemberService = class MemberService {
    async create(createMemberDto, projectId, InvitedUserId) {
        const { email } = createMemberDto;
        const newRows = await db_1.db.transaction(async (tx) => {
            const existingUser = await db_1.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
            let userId;
            if (existingUser.length === 0) {
                const newUser = await tx
                    .insert(schema_1.users)
                    .values({
                    email: email,
                })
                    .returning()
                    .execute();
                userId = newUser[0].id;
            }
            else {
                userId = existingUser[0].id;
            }
            const userOnProject = await tx
                .insert(schema_1.usersOnProjects)
                .values({
                userId: userId,
                projectId: projectId,
                status: 'pending',
                invitedBy: InvitedUserId,
                role: 'viewer',
            })
                .returning()
                .execute();
            return { userOnProject: userOnProject };
        });
        return newRows;
    }
    findAll() {
        return `This action returns all member`;
    }
    findOne(id) {
        return `This action returns a #${id} member`;
    }
    update(id, updateMemberDto) {
        return `This action updates a #${id} member`;
    }
    remove(id) {
        return `This action removes a #${id} member`;
    }
    async getAllMembersPerProject(projectId, search, rolesArray, pageSize, pageNumber) {
        const offset = (pageNumber - 1) * pageSize;
        const conditionsArray = [
            (0, drizzle_orm_1.eq)(schema_1.usersOnProjects.projectId, projectId),
            (0, drizzle_orm_1.ilike)(schema_1.users.email, `%${search}%`),
        ];
        const conditions = (0, drizzle_orm_1.and)(...conditionsArray);
        const membersList = await db_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `COUNT(*) OVER()`,
            id: schema_1.usersOnProjects.id,
            joinedAt: schema_1.usersOnProjects.joinedAt,
            userId: schema_1.usersOnProjects.userId,
            projectId: schema_1.usersOnProjects.projectId,
            invitedBy: schema_1.usersOnProjects.invitedBy,
            role: schema_1.usersOnProjects.role,
            status: schema_1.usersOnProjects.status,
            platformStatus: schema_1.users.clerkUserId,
            email: schema_1.users.email,
        })
            .from(schema_1.usersOnProjects)
            .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.usersOnProjects.userId, schema_1.users.id))
            .where(conditions)
            .limit(Number(pageSize))
            .offset(Number(offset))
            .execute();
        const totalRecords = membersList.length > 0 ? Number(membersList[0].total) : 0;
        const memberList = membersList.map(({ total, platformStatus, ...rest }) => ({
            ...rest,
            platformStatus: platformStatus ? 'complete' : 'pending',
        }));
        return { totalRecords, memberList };
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)()
], MemberService);
//# sourceMappingURL=member.service.js.map