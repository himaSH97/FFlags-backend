import { ExpressRequestWithAuth } from '@clerk/express';
type SystemInfo = {
    userId: string;
    projects: string[];
};
export type RequestWithAuthSystemInfo = ExpressRequestWithAuth & {
    systemInfo: SystemInfo;
};
export {};
