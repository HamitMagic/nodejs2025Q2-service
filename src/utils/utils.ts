import { BadRequestException } from '@nestjs/common';
import { validate } from 'uuid';

export function validateUUID(id: string) {
  console.log(id, 'uor id');
  if (validate(id)) return;
  throw new BadRequestException('Invalid id');
}
