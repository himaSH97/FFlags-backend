import { User } from '@clerk/express';

interface UserMap {
  [key: string]: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

export function getUserFields(clerkUsers: User[]): UserMap {
  return clerkUsers.reduce((acc, user) => {
    acc[user.id] = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
    };
    return acc;
  }, {} as UserMap);
}
