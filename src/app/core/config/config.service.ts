import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from './config';
import {
  tap,
  catchError,
  share,
  publishReplay,
  refCount
} from 'rxjs/operators';
import {
  throwError,
  Observable,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  of
} from 'rxjs';

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
    );

  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config> {
    return this.config$;
  }
}
