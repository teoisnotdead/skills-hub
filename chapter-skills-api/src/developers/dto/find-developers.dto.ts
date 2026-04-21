import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindDevelopersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  skillName?: string;

  @IsOptional()
  @IsString()
  levelName?: string;

  @IsOptional()
  @IsString()
  mlLevel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onlyPriority?: boolean;
}
