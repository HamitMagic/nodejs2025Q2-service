import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { validateUUID } from 'src/utils/utils';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { favorite, artists, tracks, albums } from 'src/db/tdb';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  findAll() {
    return {
      artists: favorite.artists.map((artistId) =>
        artists.find((artist) => artist.id === artistId),
      ),
      albums: favorite.albums.map((albumId) =>
        albums.find((album) => album.id === albumId),
      ),
      tracks: favorite.tracks.map((trackId) =>
        tracks.find((track) => track.id === trackId),
      ),
    };
  }

  addArtist(id: string) {
    validateUUID(id);
    try {
      this.artistsService.findOne(id);
      favorite.artists.push(id);
    } catch (error) {
      throw new HttpException('Unprocessable', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  addAlbum(id: string) {
    validateUUID(id);
    try {
      this.albumsService.findOne(id);
      favorite.albums.push(id);
    } catch (error) {
      throw new HttpException('Unprocessable', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  addTrack(id: string) {
    validateUUID(id);
    try {
      this.tracksService.findOne(id);
      favorite.tracks.push(id);
    } catch (error) {
      throw new HttpException('Unprocessable', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  removeTrack(id: string) {
    validateUUID(id);
    if (!favorite.tracks.includes(id)) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const index = favorite.tracks.findIndex((el) => el === id);
    favorite.tracks.splice(index, 1);
  }
  removeAlbum(id: string) {
    validateUUID(id);
    if (!favorite.albums.includes(id)) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const index = favorite.albums.findIndex((el) => el === id);
    favorite.albums.splice(index, 1);
  }
  removeArtist(id: string) {
    validateUUID(id);
    if (!favorite.artists.includes(id)) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const index = favorite.artists.findIndex((el) => el === id);
    favorite.artists.splice(index, 1);
  }
}
