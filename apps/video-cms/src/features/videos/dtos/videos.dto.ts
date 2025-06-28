import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  language: string;

  @IsNumber()
  duration: number;

  @IsDateString()
  publishDate: string;

  @IsDateString()
  publishedAt: string;
}

export class UpdateVideoDto extends CreateVideoDto {}
