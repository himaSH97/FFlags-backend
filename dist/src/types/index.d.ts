import { JwtPayload } from '@clerk/types';
import { Request } from 'express';
type SystemInfo = {
    userId: string;
    projects: string[];
};
export type RequestWithAuth = Request & {
    auth: JwtPayload;
};
export type RequestWithAuthSystemInfo = RequestWithAuth & {
    systemInfo: SystemInfo;
};
export {};
