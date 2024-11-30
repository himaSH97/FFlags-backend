import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class DataDto {
  @IsString()
  'ec': string;

  @IsString()
  's': string;
}

export class GetFlagDto {
  @ValidateNested()
  @Type(() => DataDto)
  'data': DataDto;
}
