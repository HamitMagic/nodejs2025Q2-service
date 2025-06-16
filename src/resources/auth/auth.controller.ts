import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/decorators/public';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.authService.create(body);
  }

  @Public()
  @Post('login')
  login(
    @Body() body: CreateUserDto,
  ) {
    return this.authService.findByLoginPassword(body);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body() body: {refreshToken: string},
  ) {
    return this.authService.RefreshTokens(body.refreshToken);
  }
}
