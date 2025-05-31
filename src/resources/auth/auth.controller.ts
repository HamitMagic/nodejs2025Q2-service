import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.userService.create(body);
  }

  @Post('login')
  login(
    @Body()
    body: CreateUserDto,
  ) {
    return this.userService.findByLoginPassword(body);
  }
}
