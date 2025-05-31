import { Album } from 'src/resources/albums/entities/album.entity';
import { Artist } from 'src/resources/artists/entities/artist.entity';
import { Favorite } from 'src/resources/favorites/entities/favorite.entity';
import { Track } from 'src/resources/tracks/entities/track.entity';
import { User } from 'src/resources/users/entities/user.entity';

export const tracks: Track[] = [];
export const artists: Artist[] = [];
export const albums: Album[] = [];
export const users: User[] = [];
export const favorite: Favorite = {
  artists: [],
  albums: [],
  tracks: [],
};
