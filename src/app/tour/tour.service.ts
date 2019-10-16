import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Tour } from './tour.model';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@app/core/logger.service';
import { ConfigService } from '@app/core/config';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  save(payload: Tour | Tour[]): Observable<Tour | Tour[]> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          if (isArray(payload)) {
            return this.http.post<Tour[]>(c.toursUrl, payload);
          } else if (payload.id) {
            return this.http.put<Tour>(`${c.toursUrl}${payload.id}`, payload);
          } else {
            return this.http.post<Tour>(c.toursUrl, payload);
          }
        })
      )
      .pipe(
        tap(i => this.logger.log('Tours save: ' + JSON.stringify(i, null, 2)))
      );
  }

  load = (): Observable<Tour[]> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<Tour[]>(c.toursUrl)))
      .pipe(tap(i => this.logger.log('Tours: ' + JSON.stringify(i, null, 2))));
  }
}
