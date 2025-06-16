import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { validateUUID } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/constants/errorMessages';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly salt = process.env.CRYPT_SALT ?? 10;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string) {
    return await hash(password, this.salt)
  };
  private async comparePassword(password: string, hashed: string) {
    return await compare(password, hashed)
  };
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
      password: await this.hashPassword(password),
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
      where: { login },
    });
    if (!currentUser) {
      throw new HttpException(ERRORS.notFound('User'), HttpStatus.NOT_FOUND);
    } else if (!this.comparePassword(password, currentUser.password)) throw new HttpException(ERRORS.notCorrectPassword, HttpStatus.FORBIDDEN);
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
    } else if (!this.comparePassword(oldPassword, currentUser.password)) {
      throw new HttpException(ERRORS.notCorrectPassword, HttpStatus.FORBIDDEN);
    }
    currentUser.password = await this.hashPassword(newPassword);
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
  }
}
