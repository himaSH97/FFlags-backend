import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  projectRole: string = '';

  @IsOptional()
  @IsString()
  description?: string;
}
