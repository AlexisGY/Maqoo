import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PantryItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  quantity?: string;
}
