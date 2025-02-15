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

export type TFlagInfo = {
  flagId: string;
  flagName: string;
  isAdvanced: boolean;
  flagKey: string;
  flagValues: { id: string; value: boolean; roleName: string }[];
}[];
