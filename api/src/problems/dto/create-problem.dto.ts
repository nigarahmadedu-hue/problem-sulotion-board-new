import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  full_description?: string[];

  @IsString()
  @IsNotEmpty()
  stage: string;

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
