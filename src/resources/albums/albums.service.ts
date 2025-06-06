import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validateUUID } from 'src/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { In, Repository } from 'typeorm';
import { ERRORS } from 'src/constants/errorMessages';
import { Favorite } from '../favorites/entities/favorite.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,

    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name) {
      throw new HttpException(
        ERRORS.notProvided("album's name"),
        HttpStatus.BAD_REQUEST,
      );
    } else if (!createAlbumDto.year) {
      throw new HttpException(
        ERRORS.notProvided("album's year"),
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum = this.albumsRepository.create({
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    });
    const result = await this.albumsRepository.save(newAlbum);
    return result;
  }

  async findAll() {
    return await this.albumsRepository.find();
  }

  async findOne(id: string) {
    validateUUID(id);
    const currentAlbum = await this.albumsRepository.findOne({ where: { id } });
    if (!currentAlbum) {
      throw new HttpException(ERRORS.notFound('Album'), HttpStatus.NOT_FOUND);
    }
    return currentAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    validateUUID(id);
    const currentAlbum = await this.albumsRepository.findOne({ where: { id } });
    if (!currentAlbum) {
      throw new HttpException(ERRORS.notFound('Album'), HttpStatus.NOT_FOUND);
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

    const result = await this.albumsRepository.save(currentAlbum);
    return result;
  }

  async remove(id: string) {
    validateUUID(id);
    const currentAlbum = await this.albumsRepository.findOne({ where: { id } });
    if (!currentAlbum) {
      throw new HttpException(ERRORS.notFound('Album'), HttpStatus.NOT_FOUND);
    }

    const favsWithAlbums = await this.favoritesRepository.find({
      where: { albums: In([id]) },
    });
    for (const favorite of favsWithAlbums) {
      favorite.artists = favorite.artists.filter((albumId) => albumId !== id);
      await this.favoritesRepository.save(favorite);
    }

    await this.albumsRepository.delete({ id });
    return { deleted: true };
  }
}
