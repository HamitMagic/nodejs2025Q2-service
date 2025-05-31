import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';
import { albums, tracks, favorite } from 'src/db/tdb';

@Injectable()
export class AlbumsService {
  constructor() {}

  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name) {
      throw new HttpException(
        "album's name not provided",
        HttpStatus.BAD_REQUEST,
      );
    } else if (!createAlbumDto.year) {
      throw new HttpException(
        "album's year not provided",
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum = {
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      id: uuId.v4(),
      artistId: createAlbumDto.artistId ?? null,
    };
    albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return albums;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentAlbum = albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return currentAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    validateUUID(id);
    const currentAlbum = albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (updateAlbumDto.artistId) {
      currentAlbum.artistId = updateAlbumDto.artistId;
    }
    if (updateAlbumDto.name) {
      currentAlbum.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year) {
      currentAlbum.year = updateAlbumDto.year;
    }
    return currentAlbum;
  }

  remove(id: string) {
    validateUUID(id);
    const currentAlbum = albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    // this.trackService.setNullToAlbum(id);
    tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
    favorite.albums = favorite.albums.filter((albumId) => albumId !== id);
    const index = albums.findIndex((album) => album.id === id);
    albums.splice(index, 1);
  }

  setNullToArtist(artistId: string) {
    validateUUID(artistId);
    albums.forEach((album) => {
      if (album.artistId === artistId) album.artistId = null;
    });
  }
}
