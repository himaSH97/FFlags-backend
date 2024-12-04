import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class MemberService {
    create(createMemberDto: CreateMemberDto, projectId: string, InvitedUserId: string): Promise<{
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
    findOne(id: number): string;
    update(id: number, updateMemberDto: UpdateMemberDto): string;
    remove(id: number): string;
    getAllMembersPerProject(projectId: string, search: string, rolesArray: string[], pageSize: number, pageNumber: number): Promise<{
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
}
