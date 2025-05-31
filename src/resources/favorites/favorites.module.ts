import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';

@Module({
  imports: [],
  controllers: [FavoritesController],
  providers: [FavoritesService, ArtistsService, TracksService, AlbumsService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
