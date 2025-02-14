import { ExpressRequestWithAuth } from '@clerk/express';
import { TUserPermissions } from 'src/permissions';

type SystemInfo = {
  userId: string;
  projects: string[];
  permissions: Record<string, TUserPermissions>;
};

export type RequestWithAuthSystemInfo = ExpressRequestWithAuth & {
  systemInfo: SystemInfo;
};
