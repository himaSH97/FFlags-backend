import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { RequestWithAuthSystemInfo } from 'src/types';
export declare class MemberController {
    private readonly memberService;
    constructor(memberService: MemberService);
    create(request: RequestWithAuthSystemInfo, projectId: string, createMemberDto: CreateMemberDto): Promise<{
        userOnProject: {
            role: "owner" | "admin" | "viewer";
            status: "active" | "pending" | "declined" | null;
            id: string;
            projectId: string;
            userId: string;
            invitedBy: string | null;
            joinedAt: Date;
        }[];
    }>;
    findAll(): string;
    getAllMembersPerProject(projectId: string, search?: string, pageSize?: number, pageNumber?: number, role?: string): Promise<{
        totalRecords: number;
        memberList: {
            platformStatus: string;
            id: string;
            joinedAt: Date;
            userId: string;
            projectId: string;
            invitedBy: string | null;
            role: "owner" | "admin" | "viewer";
            status: "active" | "pending" | "declined" | null;
            email: string;
        }[];
    }>;
    findOne(id: string): string;
    update(id: string, updateMemberDto: UpdateMemberDto): string;
    remove(id: string): string;
}
