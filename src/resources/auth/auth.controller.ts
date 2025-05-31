import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @Post()
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.userService.create(body);
  }

  @Post()
  login(
    @Body()
    body: CreateUserDto,
  ) {
    return this.userService.findByLoginPassword(body);
  }
}
