import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import * as uuId from 'uuid';

let users: CreateUserDto[] = [];

@Injectable()
export class UsersService {
  create(
    createUserDto: Omit<
      CreateUserDto,
      'id' | 'version' | 'createdAt' | 'updatedAt'
    >,
  ) {
    if (!createUserDto.login) {
      throw new HttpException('login not provided', HttpStatus.BAD_REQUEST);
    } else if (!createUserDto.password) {
      throw new HttpException('password not provided', HttpStatus.BAD_REQUEST);
    }
    users.push({
      ...createUserDto,
      id: uuId.v4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }); // I know that it creates many same users, TODO: connect DB fix problem add validation
    return createUserDto;
  }

  findAll() {
    return users.map((user) => {
      delete user.password; //deleting password for secure
      return user;
    });
  }

  findOne(id: string) {
    const currentUser = users.find((user) => user.id === id);
    if (uuId.validate(id)) {
      throw new HttpException('UserId is invalid', HttpStatus.BAD_REQUEST);
    } else if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    delete currentUser.password;
    return currentUser;
  }

  findByLoginPassword(
    body: Omit<CreateUserDto, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
  ) {
    const currentUser = users.find(
      (user) => user.password === body.password && user.login === body.password,
    );
    if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return currentUser;
  }

  update(id: string, updateUserDto: UpdatePasswordDto) {
    const currentUser = users.find((user) => user.id === id);
    if (uuId.validate(id)) {
      throw new HttpException('UserId is invalid', HttpStatus.BAD_REQUEST);
    } else if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } else if (currentUser.password !== updateUserDto.oldPassword) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    users = users.map((user) => {
      if (user.id === id) {
        user.password = updateUserDto.newPassword;
        user.updatedAt = Date.now();
      }
      return user;
    });
    return;
  }

  remove(id: string) {
    const currentUser = users.find((user) => user.id === id);
    if (uuId.validate(id)) {
      throw new HttpException('UserId is invalid', HttpStatus.BAD_REQUEST);
    } else if (!currentUser) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    users = users.filter((user) => user.id !== id);
    throw new HttpException('Deleted', HttpStatus.NO_CONTENT);
  }
}
