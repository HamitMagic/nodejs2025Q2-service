import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

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
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentAlbum = this.albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return currentAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    validateUUID(id);
    const currentAlbum = this.albums.find((album) => album.id === id);
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
    const currentAlbum = this.albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.albums = this.albums.filter((album) => album.id !== id);
    throw new HttpException('Deleted', HttpStatus.NO_CONTENT);
  }
}
