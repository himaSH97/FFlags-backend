import { IsIn, IsNotEmpty } from 'class-validator';

type TMemberRole = 'admin' | 'viewer';
export class CreateMemberDto {
  @IsNotEmpty()
  email: string = '';

  @IsNotEmpty()
  @IsIn(['admin', 'viewer'])
  role: TMemberRole = 'viewer';
}
