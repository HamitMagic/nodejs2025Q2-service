import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    if (createArtistDto.grammy === undefined) {
      throw new HttpException('grammy not provided', HttpStatus.BAD_REQUEST);
    } else if (!createArtistDto.name) {
      throw new HttpException('name not provided', HttpStatus.BAD_REQUEST);
    }
    const id = uuId.v4();
    this.artists.push({ ...createArtistDto, id });
    return { ...createArtistDto, id };
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentArtist = this.artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    validateUUID(id);
    const currentArtist = this.artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    } else if (!currentArtist) {
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
    const currentArtist = this.artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.artists = this.artists.filter((artist) => artist.id !== id);
    throw new HttpException('Deleted', HttpStatus.NO_CONTENT);
  }
}
