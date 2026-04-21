import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKnowledgeLevelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}
