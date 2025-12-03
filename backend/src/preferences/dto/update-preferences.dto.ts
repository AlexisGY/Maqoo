import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  maxTime?: number | null;

  @IsOptional()
  @IsBoolean()
  healthy?: boolean | null;

  @IsOptional()
  @IsBoolean()
  economical?: boolean | null;
}
