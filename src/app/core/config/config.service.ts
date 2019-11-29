import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import {
  publishReplay,
  refCount,
  map} from 'rxjs/operators';
import {
  Observable} from 'rxjs';
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
      seasonsUrl: `${environment.api.url}/${config.seasonsUrl}`,
      toursUrl: `${environment.api.url}/${config.toursUrl}`,
      locationsUrl: `${environment.api.url}/${config.locationsUrl}`,
      fileUrl: `${environment.api.url}/${config.fileUrl}`,
      logLevel: config.logLevel || environment.log.level
    })));

  constructor(private http: HttpClient) {
  }

  getConfig(): Observable<Config> {
    return this.config$;
  }
}
