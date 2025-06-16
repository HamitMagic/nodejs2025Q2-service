import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token } from './dto/token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.authService.create(body);
  }

  @Post('login')
  login(
    @Body()
    body: CreateUserDto,
  ) {
    return this.authService.findByLoginPassword(body);
  }

  @Post('refresh')
  refresh(
    @Body()
    body: Token,
  ) {
    return this.authService.RefreshTokens(body.refreshToken);
  }
}
