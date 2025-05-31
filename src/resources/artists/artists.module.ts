import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Module({
  imports: [],
  controllers: [ArtistsController],
  providers: [ArtistsService, AlbumsService, TracksService],
})
export class ArtistsModule {}
