import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validateUUID } from 'src/utils/utils';
import { ERRORS } from 'src/constants/errorMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { In, Repository } from 'typeorm';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Track } from '../tracks/entities/track.entity';
import { Album } from '../albums/entities/album.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,

    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,

    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,

    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name) {
      throw new HttpException(
        ERRORS.notProvided('name'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const newArtist = this.artistsRepository.create({
      name: createArtistDto.name,
      grammy: createArtistDto.grammy ?? false,
    });
    const result = await this.artistsRepository.save(newArtist);
    return result;
  }

  async findAll() {
    return this.artistsRepository.find();
  }

  async findOne(id: string) {
    validateUUID(id);
    const currentArtist = await this.artistsRepository.findOne({
      where: { id },
    });
    if (!currentArtist) {
      throw new HttpException(ERRORS.notFound('Artist'), HttpStatus.NOT_FOUND);
    }
    return currentArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    validateUUID(id);
    if (
      (updateArtistDto.grammy === undefined ||
        updateArtistDto.grammy === null) &&
      !updateArtistDto.name
    ) {
      throw new HttpException(
        ERRORS.notProvided('name or grammy'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentArtist = await this.artistsRepository.findOne({
      where: { id },
    });
    if (!currentArtist) {
      throw new HttpException(ERRORS.notFound('Artist'), HttpStatus.NOT_FOUND);
    }

    if (updateArtistDto.grammy !== undefined) {
      currentArtist.grammy = updateArtistDto.grammy;
    }
    if (updateArtistDto.name !== undefined) {
      currentArtist.name = updateArtistDto.name;
    }

    const result = await this.artistsRepository.save(currentArtist);
    return result;
  }

  async remove(id: string) {
    validateUUID(id);
    const currentArtist = await this.artistsRepository.findOne({
      where: { id },
    });
    if (!currentArtist) {
      throw new HttpException(ERRORS.notFound('Artist'), HttpStatus.NOT_FOUND);
    }

    await this.artistsRepository.delete({ id });
    return { deleted: true };
  }

  async getByIds(ids: string[]) {
    return await this.artistsRepository.find({
      where: { id: In(ids) },
    });
  }
}
