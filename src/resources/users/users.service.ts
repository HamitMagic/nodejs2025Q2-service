import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { validateUUID } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/constants/errorMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  private deletePassword(user: User) {
    return {
      login: user.login,
      id: user.id,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    if (!login) {
      throw new HttpException(
        ERRORS.notProvided('Login'),
        HttpStatus.BAD_REQUEST,
      );
    } else if (!password) {
      throw new HttpException(
        ERRORS.notProvided('Password'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = this.usersRepository.create({
      login,
      password,
    });
    const result = await this.usersRepository.save(newUser);
    return this.deletePassword(result);
  }

  async findAll() {
    const allUsers = await this.usersRepository.find();
    return allUsers.map((user) => this.deletePassword(user));
  }

  async findOne(id: string) {
    validateUUID(id);
    const currentUser = await this.usersRepository.findOne({ where: { id } });
    if (!currentUser) {
      throw new HttpException(ERRORS.notFound('User'), HttpStatus.NOT_FOUND);
    }
    return this.deletePassword(currentUser);
  }

  async findByLoginPassword(body: CreateUserDto) {
    const { login, password } = body;
    if (!login || !password) {
      throw new HttpException(
        ERRORS.notProvided('login or password'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUser = await this.usersRepository.findOne({
      where: { login, password },
    });
    if (!currentUser) {
      throw new HttpException(ERRORS.notFound('User'), HttpStatus.NOT_FOUND);
    }
    return this.deletePassword(currentUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    validateUUID(id);
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        ERRORS.notFound('old or new password'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentUser = await this.usersRepository.findOne({ where: { id } });
    if (!currentUser) {
      throw new HttpException(ERRORS.notFound('User'), HttpStatus.NOT_FOUND);
    } else if (currentUser.password !== oldPassword) {
      throw new HttpException(ERRORS.notCorrectPassword, HttpStatus.FORBIDDEN);
    }
    currentUser.password = newPassword;
    currentUser.version += 1;
    currentUser.updatedAt = new Date(Date.now());
    const result = await this.usersRepository.save(currentUser);
    return this.deletePassword(result);
  }

  async remove(id: string) {
    validateUUID(id);
    const currentUser = await this.usersRepository.findOne({ where: { id } });
    if (!currentUser) {
      throw new HttpException(ERRORS.notFound('User'), HttpStatus.NOT_FOUND);
    }
    return await this.usersRepository.delete({ id });
    return { deleted: true };
  }
}
