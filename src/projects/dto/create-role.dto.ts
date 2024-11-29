import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string = '';

  @IsOptional()
  @IsString()
  description?: string;
}
