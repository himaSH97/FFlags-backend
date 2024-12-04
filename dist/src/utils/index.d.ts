export interface ChangedFields {
    previous: Record<string, any>;
    current: Record<string, any>;
}
export declare function generateChangedFields(previousObj: Record<string, any>, currentObj: Record<string, any>, omitFields?: string[]): ChangedFields;
export declare function createKeyFromName(input: string): string;
