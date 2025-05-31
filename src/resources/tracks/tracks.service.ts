import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.duration) {
      throw new HttpException(
        'track duration not provided',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!createTrackDto.name) {
      throw new HttpException(
        'track name not provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack: Track = {
      duration: createTrackDto.duration,
      name: createTrackDto.name,
      id: uuId.v4(),
      albumId: createTrackDto.albumId ?? null,
      artistId: createTrackDto.artistId ?? null,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentTrack = this.tracks.find(
      (track) => track.id.toString() === id.toString(),
    );
    if (!currentTrack) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return currentTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    validateUUID(id);
    const currentTrack = this.tracks.find((track) => track.id === id);
    if (!currentTrack) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
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
    return currentTrack;
  }

  remove(id: string) {
    validateUUID(id);
    const currentTrack = this.tracks.find((track) => track.id === id);
    if (!currentTrack) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
