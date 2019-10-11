import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from './current-user.models';
import { LoggerService } from '../logger.service';
import { ConfigService } from '../config';
import { HttpClient } from '@angular/common/http';
import { httpInterceptorProviders } from '../http-interceptors';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor(private logger: LoggerService, private configService: ConfigService, private http: HttpClient) {}

  registerCurrentUser(user: User): Observable<User> {
    return this.configService.getConfig()
      .pipe(switchMap(c => this.http.post<User>(c.usersUrl, user)))
      .pipe(tap(i => this.logger.log('Users: ' + JSON.stringify(i, null, 2))));
  }

  getCurrentUser(sub: string): Observable<User> {
     this.logger.log('Sub' + sub);

     return this.configService.getConfig()
     .pipe(switchMap(c => this.http.get<User>(`${c.usersUrl}${sub}`)), catchError(error => of(undefined)))
     .pipe(tap(i => this.logger.log('User: ' + JSON.stringify(i, null, 2))));
  }
}
