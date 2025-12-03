import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  instrucciones?: string;

  @IsArray()
  ingredientes!: string[];

  @IsInt()
  @Min(1)
  @Max(600)
  tiempo!: number;

  @IsOptional()
  @IsBoolean()
  saludable?: boolean;

  @IsOptional()
  @IsBoolean()
  economico?: boolean;
}
