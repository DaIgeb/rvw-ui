import { Injectable } from '@angular/core';
import { ConfigService } from './config';
import { TLogLevel, isEnabled } from './logger.model';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logLevel: any;
  constructor(private config: ConfigService) {
    this.config.getConfig().subscribe(c => this.logLevel = c.logLevel)
  }

  log(msg: string, level: TLogLevel = 'log') {
    if (isEnabled(level, this.logLevel)) {
      switch (level) {
        case "debug":
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
