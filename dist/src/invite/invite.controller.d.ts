import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { RequestWithAuthSystemInfo } from 'src/types';
export declare class InviteController {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    create(createInviteDto: CreateInviteDto): string;
    findAll(request: RequestWithAuthSystemInfo): Promise<{
        role: "owner" | "admin" | "viewer";
        status: "active" | "pending" | "declined" | null;
        id: string;
        projectId: string;
        userId: string;
        invitedBy: string | null;
        joinedAt: Date;
    }[]>;
    findOne(id: string): string;
    update(id: string, updateInviteDto: UpdateInviteDto): string;
    remove(id: string): string;
}
