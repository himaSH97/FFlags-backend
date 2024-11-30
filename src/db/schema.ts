import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  uuid,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';

// Define enums for role and status
export const roleEnum = pgEnum('role', ['owner', 'admin', 'viewer']);
export const statusEnum = pgEnum('status', ['active', 'pending', 'declined']);
export const auditEntityTypeEnum = pgEnum('entity_type', [
  'feature_flags',
  'feature_flag_values',
]);
export const auditEntityActionEnum = pgEnum('entity_action', [
  'create',
  'update',
  'delete',
]);
// Users table
export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  clerkUserId: varchar('clerk_user_id', { length: 100 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`NOW()`),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  createdBy: uuid('created_by')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`NOW()`),
});

//Project Keys table

export const projectKeys = pgTable('project_keys', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  serverPublicKey: varchar('server_public_key', { length: 2048 }).notNull(),
  serverPrivateKey: varchar('server_private_key', { length: 2048 }).notNull(),
  projectPublicKey: varchar('project_public_key', { length: 2048 }).notNull(),
  projectPrivateKey: varchar('project_private_key', { length: 2048 }).notNull(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Project Roles table
export const projectRoles = pgTable('project_roles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  projectRole: varchar('project_role', { length: 50 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`NOW()`),
});

// Users on Projects table
export const usersOnProjects = pgTable(
  'users_on_projects',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    role: roleEnum('role').default('viewer').notNull(),
    invitedBy: uuid('invited_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    status: statusEnum('status').default('pending'),
  },
  (table) => [
    uniqueIndex('unique_project_user').on(table.projectId, table.userId),
  ],
);

// Feature Flags table
export const featureFlags = pgTable('feature_flags', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  flagKey: varchar('flag_key', { length: 150 }).notNull().unique(),
  isAdvanced: boolean('is_advanced').default(false).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`NOW()`),
});

// Feature Flag Values table

export const featureFlagValues = pgTable(
  'feature_flag_values',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`)
      .notNull(),
    flagId: uuid('flag_id')
      .references(() => featureFlags.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: uuid('role_id')
      .references(() => projectRoles.id, { onDelete: 'cascade' })
      .notNull(),
    value: boolean('value').default(false).notNull(),
    visibilityLevel: integer('visibility_level').default(100).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`NOW()`),
  },
  (t) => [uniqueIndex('unique_flag_role').on(t.flagId, t.roleId)],
);

export const auditHistory = pgTable('audit_history', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  entityId: uuid('entity_id').notNull(),
  entityType: auditEntityTypeEnum('entity_type').notNull(),
  entityAction: auditEntityActionEnum('entity_action').notNull(),
  changedFields: jsonb('changed_fields').notNull(),
  changedBy: uuid('changed_by')
    .references(() => users.id, { onDelete: 'restrict' })
    .notNull(),
  changedAt: timestamp('changed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
