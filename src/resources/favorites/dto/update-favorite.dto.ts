import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteDto } from './create-favorite.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {
  @IsOptional()
  @IsArray()
  artists: string[];

  @IsOptional()
  @IsArray()
  albums: string[];

  @IsOptional()
  @IsArray()
  tracks: string[];
}
