import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { IDetail, IList } from 'rvw-model/lib/route';
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
  ) { }

  save(payload: IDetail | IDetail[]): Observable<IDetail | IDetail[]> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          if (isArray(payload)) {
            return this.http.post<IDetail[]>(c.routesUrl, payload);
          } else if (payload.id) {
            return this.http.put<IDetail>(`${c.routesUrl}${payload.id}`, payload);
          } else {
            return this.http.post<IDetail>(c.routesUrl, payload);
          }
        })
      )
      .pipe(
        tap(i => this.logger.log('Routes save: ' + JSON.stringify(i, null, 2)))
      );
  }

  load = (): Observable<IList[]> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<IDetail[]>(c.routesUrl)))
      .pipe(tap(i => this.logger.log('Routes: ' + JSON.stringify(i, null, 2))));
  }

  loadDetail = (id: string): Observable<IDetail> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<IDetail>(`${c.routesUrl}/${id}`)))
      .pipe(tap(i => this.logger.log('Routes: ' + JSON.stringify(i, null, 2))));
  }
}
