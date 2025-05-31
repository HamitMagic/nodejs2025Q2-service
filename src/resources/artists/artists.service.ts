import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';
import { albums, artists, favorite, tracks } from 'src/db/tdb';

@Injectable()
export class ArtistsService {
  constructor() {}

  create(createArtistDto: CreateArtistDto) {
    if (createArtistDto.grammy === undefined) {
      throw new HttpException('grammy not provided', HttpStatus.BAD_REQUEST);
    } else if (!createArtistDto.name) {
      throw new HttpException('name not provided', HttpStatus.BAD_REQUEST);
    }
    const id = uuId.v4();
    artists.push({ ...createArtistDto, id });
    return { ...createArtistDto, id };
  }

  findAll() {
    return artists;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentArtist = artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return currentArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    validateUUID(id);
    const currentArtist = artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (updateArtistDto.grammy !== undefined) {
      currentArtist.grammy = updateArtistDto.grammy;
    }
    if (updateArtistDto.name !== undefined) {
      currentArtist.name = updateArtistDto.name;
    }
    return currentArtist;
  }

  remove(id: string) {
    validateUUID(id);
    const currentArtist = artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    favorite.artists = favorite.artists.filter((artistId) => artistId !== id);
    const index = artists.findIndex((artist) => artist.id === id);
    artists.splice(index, 1);
  }
}
