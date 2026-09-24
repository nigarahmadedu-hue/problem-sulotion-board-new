import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  who_would_use?: string;

  @IsOptional()
  @IsString()
  needed_to_build?: string;
}
