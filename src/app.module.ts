import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { ArtistsModule } from './resources/artists/artists.module';
import { AlbumsModule } from './resources/albums/albums.module';
import { TracksModule } from './resources/tracks/tracks.module';
import { FavoritesModule } from './resources/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggingService } from './services/logging/logging.service';
import { AuthService } from './resources/auth/auth.service';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  
  ],
})
export class AppModule {}
