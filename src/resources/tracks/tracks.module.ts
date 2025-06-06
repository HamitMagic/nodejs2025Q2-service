import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Track } from './entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Favorite])],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
