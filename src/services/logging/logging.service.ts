import { ConsoleLogger, Injectable } from '@nestjs/common';
import { writeFile } from 'node:fs/promises';

@Injectable()
export class LoggingService extends ConsoleLogger {
  log(message: string, context: string): void {
    
  }

  error(message: string, context: string): void {

  }
}
