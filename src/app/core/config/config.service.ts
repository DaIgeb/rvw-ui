import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import {
  publishReplay,
  refCount,
  map,
  catchError
} from 'rxjs/operators';
import {
  Observable, of} from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/config.json';
  private config$: Observable<Config> = this.http
    .get<Config>(this.configUrl)
    .pipe(
      publishReplay(1),
      refCount()
    )
    .pipe(map(config => ({
      ...config,
      membersUrl: `${environment.api.url}/${config.membersUrl}`,
      usersUrl: `${environment.api.url}/${config.usersUrl}`,
      routesUrl: `${environment.api.url}/${config.routesUrl}`,
      toursUrl: `${environment.api.url}/${config.toursUrl}`,
      logLevel: config.logLevel || environment.log.level
    })));

  constructor(private http: HttpClient) {
  }

  getConfig(): Observable<Config> {
    return this.config$;
  }
}
