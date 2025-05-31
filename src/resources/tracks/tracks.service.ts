import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';
import { favorite, tracks } from 'src/db/tdb';

@Injectable()
export class TracksService {
  constructor() {}

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
    const newTrack = {
      duration: createTrackDto.duration,
      name: createTrackDto.name,
      id: uuId.v4(),
      albumId: createTrackDto.albumId ?? null,
      artistId: createTrackDto.artistId ?? null,
    };
    tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    validateUUID(id);
    const currentTrack = tracks.find((track) => track.id === id);
    if (!currentTrack) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return currentTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    validateUUID(id);
    const currentTrack = tracks.find((track) => track.id === id);
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
    const currentTrack = tracks.find((track) => track.id === id);
    if (!currentTrack) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    favorite.tracks = favorite.tracks.filter((trackId) => trackId !== id);
    const index = tracks.findIndex((track) => track.id === id);
    tracks.splice(index, 1);
  }

  setNullToArtist(artistId: string) {
    validateUUID(artistId);
    tracks.forEach((track) => {
      if (track.artistId === artistId) track.artistId = null;
    });
  }

  setNullToAlbum(albumId: string) {
    validateUUID(albumId);
    tracks.forEach((track) => {
      if (track.albumId === albumId) track.albumId = null;
    });
  }
}
