import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Favorite])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
