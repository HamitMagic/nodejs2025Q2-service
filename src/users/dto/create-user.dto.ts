export class CreateUserDto {
  login: string;
  password: string;
  id: string; // uuid v4
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
