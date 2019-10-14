import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Route } from './route.model';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@app/core/logger.service';
import { ConfigService } from '@app/core/config';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) {}

  save(payload: Route | Route[]): Observable<Route | Route[]> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          if (isArray(payload)) {
            return this.http.post<Route[]>(c.routesUrl, payload);
          } else if (payload.id) {
            return this.http.put<Route>(`${c.routesUrl}${payload.id}`, payload);
          } else {
            return this.http.post<Route>(c.routesUrl, payload);
          }
        })
      )
      .pipe(
        tap(i => this.logger.log('Routes save: ' + JSON.stringify(i, null, 2)))
      );
  }

  load = (): Observable<Route[]> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<Route[]>(c.routesUrl)))
      .pipe(tap(i => this.logger.log('Routes: ' + JSON.stringify(i, null, 2))));
  };
}
