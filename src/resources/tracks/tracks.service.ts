import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validateUUID } from 'src/utils/utils';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from '../favorites/entities/favorite.entity';
import { In, Repository } from 'typeorm';
import { ERRORS } from 'src/constants/errorMessages';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,

    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration, artistId, albumId } = createTrackDto;
    if (!duration) {
      throw new HttpException(
        ERRORS.notProvided("Track's duration"),
        HttpStatus.BAD_REQUEST,
      );
    } else if (!name) {
      throw new HttpException(
        ERRORS.notProvided("Track's name"),
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack = this.tracksRepository.create({
      duration,
      name,
      albumId: albumId ?? null,
      artistId: artistId ?? null,
    });
    const result = await this.tracksRepository.save(newTrack);
    return result;
  }

  async findAll() {
    return await this.tracksRepository.find();
  }

  async findOne(id: string) {
    validateUUID(id);
    const currentTrack = await this.tracksRepository.findOne({ where: { id } });
    if (!currentTrack) {
      throw new HttpException(ERRORS.notFound('track'), HttpStatus.NOT_FOUND);
    }
    return currentTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    validateUUID(id);
    const currentTrack = await this.tracksRepository.findOne({ where: { id } });
    if (!currentTrack) {
      throw new HttpException(ERRORS.notFound('track'), HttpStatus.NOT_FOUND);
    }
    if (updateTrackDto.albumId) {
      currentTrack.albumId = updateTrackDto.albumId;
    }
    if (updateTrackDto.artistId) {
      currentTrack.artistId = updateTrackDto.artistId;
    }
    if (updateTrackDto.duration) {
      currentTrack.duration = updateTrackDto.duration;
    }
    if (updateTrackDto.name) {
      currentTrack.name = updateTrackDto.name;
    }
    const result = await this.tracksRepository.save(currentTrack);
    return result;
  }

  async remove(id: string) {
    validateUUID(id);
    const currentTrack = await this.tracksRepository.findOne({ where: { id } });
    if (!currentTrack) {
      throw new HttpException(ERRORS.notFound('track'), HttpStatus.NOT_FOUND);
    }
    await this.tracksRepository.delete({ id });

    const allFavorites = await this.favoritesRepository.find({
      where: { tracks: In([id]) },
    });

    for (const fav of allFavorites) {
      fav.tracks = fav.tracks.filter((trackId) => trackId !== id);
      await this.favoritesRepository.save(fav);
    }

    return { deleted: true };
  }
}
