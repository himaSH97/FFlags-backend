import { clerkClient, User } from '@clerk/express';
import { Doc } from 'src/db/types';

interface UserMap {
  [key: string]: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

export default class ClerkUtils {
  static getUserFields(clerkUsers: User[]): UserMap {
    return clerkUsers.reduce((acc, user) => {
      acc[user.id] = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
      };
      return acc;
    }, {} as UserMap);
  }

  static async getClerkUsers(userIds: string[]): Promise<User[]> {
    const clerkUsers = await clerkClient.users.getUserList({
      userId: [...userIds],
    });

    return clerkUsers.data;
  }
}
