import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT } from 'src/constants/jwtConstants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT.secretKey,
      signOptions: { expiresIn: JWT.accessInspireIn },
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
