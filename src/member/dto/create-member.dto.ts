import { IsNotEmpty } from 'class-validator';
export class CreateMemberDto {
  @IsNotEmpty()
  email: string = '';
}
