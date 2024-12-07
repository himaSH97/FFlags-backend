import { ExpressRequestWithAuth } from '@clerk/express';
import { JwtPayload } from '@clerk/types';
import { Request } from 'express';

type SystemInfo = {
  userId: string;
  projects: string[];
};

export type RequestWithAuthSystemInfo = ExpressRequestWithAuth & {
  systemInfo: SystemInfo;
};
