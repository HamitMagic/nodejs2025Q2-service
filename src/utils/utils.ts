import { BadRequestException } from '@nestjs/common';
import { validate } from 'uuid';

export function validateUUID(id: string) {
  if (!validate(id)) throw new BadRequestException('Invalid id');
}
