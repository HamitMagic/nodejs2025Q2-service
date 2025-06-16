import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERRORS } from 'src/constants/errorMessages';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from './dto/token.dto';
import 'dotenv/config';

@Injectable()
export class AuthService {
  private readonly refreshExpireAt = process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '48h';
  private readonly jwtRefreshSecret = process.env.JWT_SECRET_REFRESH_KEY ?? 'secret54';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ){
  }

  async create(user: CreateUserDto) {
    const newUser = await this.userService.create(user);
    if (!newUser) throw new HttpException(
      ERRORS.unknownError,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const payload = { sub: newUser.id, username: newUser.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync({...payload, accessToken}, {
      expiresIn: this.refreshExpireAt
    });
    return {refreshToken, accessToken} as Token;
  };

  async findByLoginPassword(user: CreateUserDto) {
    try {
      const newUser = await this.userService.findByLoginPassword(user);
      const payload = { sub: newUser.id, username: newUser.login };
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync({...payload, accessToken}, {
        expiresIn: this.refreshExpireAt
      });
      return {refreshToken, accessToken} as Token;
    } catch (error) {
      if (error.status === 404) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      throw error;
    }
  };

  async RefreshTokens(token: string) {
    if (!token) throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

    
  };
}
