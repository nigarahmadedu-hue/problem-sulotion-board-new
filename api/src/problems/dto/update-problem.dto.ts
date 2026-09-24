import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateProblemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  full_description?: string[];

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsArray()
  who_faces_it?: string[];

  @IsOptional()
  evidence_references?: number;

  @IsOptional()
  evidence_images?: number;

  @IsOptional()
  evidence_solutions?: number;

  @IsOptional()
  @IsArray()
  looking_for_roles?: any[];
}
