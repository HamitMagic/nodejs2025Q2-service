import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Param('id') trackId: string) {
    return this.favoritesService.addTrack(trackId);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id') trackId: string) {
    return this.favoritesService.removeTrack(trackId);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Param('id') artistId: string) {
    return this.favoritesService.addArtist(artistId);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id') artistId: string) {
    return this.favoritesService.removeArtist(artistId);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('id') albumId: string) {
    return this.favoritesService.addAlbum(albumId);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') albumId: string) {
    return this.favoritesService.removeAlbum(albumId);
  }
}
