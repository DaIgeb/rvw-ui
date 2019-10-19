import { Injectable } from '@angular/core';
import { TLogLevel, isEnabled } from './logger.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: TLogLevel = 'log';
  constructor() {
    this.logLevel = environment.log.level;
  }

  log(msg: string, level: TLogLevel = 'log') {
    if (isEnabled(level, this.logLevel)) {
      switch (level) {
        case 'debug':
          console.debug(msg);
          break;
        case 'info':
          console.info(msg);
          break;
        case 'log':
          console.log(msg);
          break;
        case 'warn':
          console.warn(msg);
          break;
        case 'error':
          console.error(msg);
          break;
      }
    }
  }

  error(msg: string) {
    this.log(msg, 'error');
  }
}
