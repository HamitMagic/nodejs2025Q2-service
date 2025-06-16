import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track, Favorite])],
  controllers: [ArtistsController],
  providers: [ArtistsService, AlbumsService, TracksService],
})
export class ArtistsModule {}
