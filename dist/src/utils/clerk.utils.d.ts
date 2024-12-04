import { User } from '@clerk/express';
interface UserMap {
    [key: string]: {
        firstName: string;
        lastName: string;
        imageUrl: string;
    };
}
export declare function getUserFields(clerkUsers: User[]): UserMap;
export {};
