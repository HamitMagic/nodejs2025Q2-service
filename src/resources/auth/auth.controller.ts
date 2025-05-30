import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @Post()
  create(
    @Body()
    body: Omit<CreateUserDto, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.userService.create(body);
  }

  @Post()
  login(
    @Body()
    body: Omit<CreateUserDto, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.userService.findByLoginPassword(body);
  }
}
