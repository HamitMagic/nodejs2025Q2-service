import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  duration: number; // integer number

  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}
