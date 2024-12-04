import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import * as schema from './schema';
type SchemaTableNames = {
    [TableOrRelationName in keyof typeof schema]: (typeof schema)[TableOrRelationName] extends PgTableWithColumns<any> ? TableOrRelationName : never;
}[keyof typeof schema];
type DBSelectTypeMap = {
    [TableName in SchemaTableNames]: InferSelectModel<(typeof schema)[TableName]>;
};
export type Doc<TableName extends keyof DBSelectTypeMap> = DBSelectTypeMap[TableName];
type DBInsertTypeMap = {
    [TableName in SchemaTableNames]: InferInsertModel<(typeof schema)[TableName]>;
};
export type DocInsert<TableName extends keyof DBInsertTypeMap> = DBInsertTypeMap[TableName];
export {};
