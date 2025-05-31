import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as uuId from 'uuid';
import { validateUUID } from 'src/utils/utils';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private deletePassword(user: User) {
    return {
      login: user.login,
      id: user.id,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login) {
      throw new HttpException('login not provided', HttpStatus.BAD_REQUEST);
    } else if (!createUserDto.password) {
      throw new HttpException('password not provided', HttpStatus.BAD_REQUEST);
    }
    const newUser = {
      ...createUserDto,
      id: uuId.v4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser); // I know that it creates many same users, TODO: connect DB fix problem add validation
    return this.deletePassword(newUser);
  }

  findAll() {
    return this.users.map((user) => this.deletePassword(user));
  }

  findOne(id: string) {
    validateUUID(id);
    const currentUser = this.users.find((user) => user.id === id);
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.deletePassword(currentUser);
  }

  findByLoginPassword(body: CreateUserDto) {
    const currentUser = this.users.find(
      (user) => user.password === body.password && user.login === body.password,
    );
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.deletePassword(currentUser);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    validateUUID(id);
    const currentUser = this.users.find((user) => user.id === id);
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (currentUser.password !== updateUserDto.oldPassword) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    this.users = this.users.map((user) => {
      if (user.id === id) {
        user.password = updateUserDto.newPassword;
        user.updatedAt = Date.now();
      }
      return user;
    });
    return;
  }

  remove(id: string) {
    validateUUID(id);
    const currentUser = this.users.find((user) => user.id === id);
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.users = this.users.filter((user) => user.id !== id);
    throw new HttpException('Deleted', HttpStatus.NO_CONTENT);
  }
}
