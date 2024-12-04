import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
export declare class InviteService {
    create(createInviteDto: CreateInviteDto): string;
    findAll(userId: string): Promise<{
        role: "owner" | "admin" | "viewer";
        status: "active" | "pending" | "declined" | null;
        id: string;
        projectId: string;
        userId: string;
        invitedBy: string | null;
        joinedAt: Date;
    }[]>;
    findOne(id: number): string;
    update(id: number, updateInviteDto: UpdateInviteDto): string;
    remove(id: number): string;
}
