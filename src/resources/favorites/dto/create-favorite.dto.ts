import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsArray()
  @IsNotEmpty()
  artists: string[];

  @IsNotEmpty()
  @IsArray()
  albums: string[];

  @IsNotEmpty()
  @IsArray()
  tracks: string[];
}
