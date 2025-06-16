import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERRORS } from 'src/constants/errorMessages';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { JWT } from 'src/constants/jwtConstants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ){}

  async create(user: CreateUserDto) {
    const newUser = await this.userService.create(user);
    if (!newUser) throw new HttpException(
      ERRORS.unknownError,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const payload = { userId: newUser.id, login: newUser.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync({...payload, accessToken}, {
      expiresIn: JWT.refreshInspireIn,
      secret: JWT.refreshSecretKey,
    });
    return { refreshToken, accessToken, id: newUser.id };
  };

  async findByLoginPassword(user: CreateUserDto) {
    const newUser = await this.userService.findByLoginPassword(user);
    const payload = { userId: newUser.id, login: newUser.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync({...payload, accessToken}, {
      expiresIn: JWT.refreshInspireIn,
    });
    return { refreshToken, accessToken, id: newUser.id };
  };

  async RefreshTokens(token: string) {
    if (!token) throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
    try {
      console.log(11111)
      const payload = await this.jwtService.verifyAsync(token);
      console.log(payload)
      const { userId, login } = payload;
      const newPayload = { userId, login };
      const accessToken = await this.jwtService.signAsync(newPayload);
      const refreshToken = await this.jwtService.signAsync({...newPayload, accessToken}, {
        expiresIn: JWT.refreshInspireIn,
        secret: JWT.refreshInspireIn,
      });
      return {refreshToken, accessToken};
    } catch (error) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
    }
  };
}
