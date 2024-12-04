"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditHistory = exports.featureFlagValues = exports.featureFlags = exports.usersOnProjects = exports.projectRoles = exports.projectKeys = exports.projects = exports.users = exports.auditEntityActionEnum = exports.auditEntityTypeEnum = exports.statusEnum = exports.roleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['owner', 'admin', 'viewer']);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['active', 'pending', 'declined']);
exports.auditEntityTypeEnum = (0, pg_core_1.pgEnum)('entity_type', [
    'feature_flags',
    'feature_flag_values',
]);
exports.auditEntityActionEnum = (0, pg_core_1.pgEnum)('entity_action', [
    'create',
    'update',
    'delete',
]);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    clerkUserId: (0, pg_core_1.varchar)('clerk_user_id', { length: 100 }).unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `NOW()`),
});
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 150 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdBy: (0, pg_core_1.uuid)('created_by')
        .references(() => exports.users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `NOW()`),
});
exports.projectKeys = (0, pg_core_1.pgTable)('project_keys', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    serverPublicKey: (0, pg_core_1.varchar)('server_public_key', { length: 2048 }).notNull(),
    serverPrivateKey: (0, pg_core_1.varchar)('server_private_key', { length: 2048 }).notNull(),
    projectPublicKey: (0, pg_core_1.varchar)('project_public_key', { length: 2048 }).notNull(),
    projectPrivateKey: (0, pg_core_1.varchar)('project_private_key', { length: 2048 }).notNull(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .references(() => exports.projects.id, { onDelete: 'cascade' })
        .unique()
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.projectRoles = (0, pg_core_1.pgTable)('project_roles', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .references(() => exports.projects.id, { onDelete: 'cascade' })
        .notNull(),
    projectRole: (0, pg_core_1.varchar)('project_role', { length: 50 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `NOW()`),
});
exports.usersOnProjects = (0, pg_core_1.pgTable)('users_on_projects', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => exports.users.id, { onDelete: 'cascade' })
        .notNull(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .references(() => exports.projects.id, { onDelete: 'cascade' })
        .notNull(),
    role: (0, exports.roleEnum)('role').default('viewer').notNull(),
    invitedBy: (0, pg_core_1.uuid)('invited_by').references(() => exports.users.id, {
        onDelete: 'set null',
    }),
    joinedAt: (0, pg_core_1.timestamp)('joined_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    status: (0, exports.statusEnum)('status').default('pending'),
}, (table) => [
    (0, pg_core_1.uniqueIndex)('unique_project_user').on(table.projectId, table.userId),
]);
exports.featureFlags = (0, pg_core_1.pgTable)('feature_flags', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    projectId: (0, pg_core_1.uuid)('project_id')
        .references(() => exports.projects.id, { onDelete: 'cascade' })
        .notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 150 }).notNull(),
    flagKey: (0, pg_core_1.varchar)('flag_key', { length: 150 }).notNull().unique(),
    isAdvanced: (0, pg_core_1.boolean)('is_advanced').default(false).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `NOW()`),
});
exports.featureFlagValues = (0, pg_core_1.pgTable)('feature_flag_values', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    flagId: (0, pg_core_1.uuid)('flag_id')
        .references(() => exports.featureFlags.id, { onDelete: 'cascade' })
        .notNull(),
    roleId: (0, pg_core_1.uuid)('role_id')
        .references(() => exports.projectRoles.id, { onDelete: 'cascade' })
        .notNull(),
    value: (0, pg_core_1.boolean)('value').default(false).notNull(),
    visibilityLevel: (0, pg_core_1.integer)('visibility_level').default(100).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `NOW()`),
}, (t) => [(0, pg_core_1.uniqueIndex)('unique_flag_role').on(t.flagId, t.roleId)]);
exports.auditHistory = (0, pg_core_1.pgTable)('audit_history', {
    id: (0, pg_core_1.uuid)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `uuid_generate_v4()`)
        .notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id').notNull(),
    entityType: (0, exports.auditEntityTypeEnum)('entity_type').notNull(),
    entityAction: (0, exports.auditEntityActionEnum)('entity_action').notNull(),
    changedFields: (0, pg_core_1.jsonb)('changed_fields').notNull(),
    changedBy: (0, pg_core_1.uuid)('changed_by')
        .references(() => exports.users.id, { onDelete: 'restrict' })
        .notNull(),
    changedAt: (0, pg_core_1.timestamp)('changed_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
//# sourceMappingURL=schema.js.map