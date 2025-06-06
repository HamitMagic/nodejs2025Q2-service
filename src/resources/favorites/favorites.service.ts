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
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../tracks/entities/track.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { ERRORS } from 'src/constants/errorMessages';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  private async getOrCreateFavorite() {
    let fav = await this.favoritesRepository.findOne({});
    if (!fav) {
      fav = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      fav = await this.favoritesRepository.save(fav);
    }
    return fav;
  }

  async findAll() {
    const favorites = await this.getOrCreateFavorite();
    const entityMap = {
      artists: this.artistsService,
      albums: this.albumsService,
      tracks: this.tracksService,
    };
    const resolvedEntities = await Promise.all(
      Object.entries(entityMap).map(async ([key, service]) => {
        const ids = favorites[key] || [];
        const items = await Promise.all(
          ids.map(async (id: string) => {
            try {
              return await service.findOne(id);
            } catch {
              return null;
            }
          }),
        );
        return [key, items];
      }),
    );
    const result = Object.fromEntries(resolvedEntities);
    return {
      artists: result.artists.filter(
        (artist: Artist | null) => artist !== null,
      ),
      albums: result.albums.filter((album: Album | null) => album !== null),
      tracks: result.tracks.filter((track: Track | null) => track !== null),
    };
  }

  async addArtist(id: string) {
    validateUUID(id);
    let artist: Artist;
    try {
      artist = await this.artistsService.findOne(id);
    } catch {
      throw new HttpException(
        ERRORS.notFound('Artist'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const fav = await this.getOrCreateFavorite();
    if (fav.artists.includes(id)) {
      throw new HttpException(
        ERRORS.alreadyExists('Artist'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    fav.artists.push(id);
    await this.favoritesRepository.save(fav);
    return artist;
  }

  async addAlbum(id: string) {
    validateUUID(id);
    let album: Album;
    try {
      album = await this.albumsService.findOne(id);
    } catch {
      throw new HttpException(
        ERRORS.notFound('Album'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const fav = await this.getOrCreateFavorite();
    if (fav.albums.includes(id)) {
      throw new HttpException(
        ERRORS.alreadyExists('Album'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    fav.albums.push(id);
    await this.favoritesRepository.save(fav);
    return album;
  }

  async addTrack(id: string) {
    validateUUID(id);
    let track: Track;
    try {
      track = await this.tracksService.findOne(id);
    } catch {
      throw new HttpException(
        ERRORS.notFound('Track'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const fav = await this.getOrCreateFavorite();
    if (fav.tracks.includes(id)) {
      throw new HttpException(
        ERRORS.alreadyExists('Track'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    fav.tracks.push(id);
    await this.favoritesRepository.save(fav);
    return track;
  }

  async removeTrack(id: string) {
    validateUUID(id);
    const fav = await this.getOrCreateFavorite();

    if (!fav.tracks.includes(id)) {
      throw new HttpException(
        ERRORS.notFound('Track in favorites'),
        HttpStatus.NOT_FOUND,
      );
    }

    fav.tracks = fav.tracks.filter((trackId) => trackId !== id);
    await this.favoritesRepository.save(fav);
    return { removedId: id };
  }

  async removeAlbum(id: string) {
    validateUUID(id);
    const fav = await this.getOrCreateFavorite();

    if (!fav.albums.includes(id)) {
      throw new HttpException(
        ERRORS.notFound('Album in favorites'),
        HttpStatus.NOT_FOUND,
      );
    }

    fav.albums = fav.albums.filter((albumId) => albumId !== id);
    await this.favoritesRepository.save(fav);
    return { removedId: id };
  }

  async removeArtist(id: string) {
    validateUUID(id);
    const fav = await this.getOrCreateFavorite();

    if (!fav.artists.includes(id)) {
      throw new HttpException(
        ERRORS.notFound('Artist in favorites'),
        HttpStatus.NOT_FOUND,
      );
    }

    fav.artists = fav.artists.filter((artistId) => artistId !== id);
    await this.favoritesRepository.save(fav);
    return { removedId: id };
  }
}
