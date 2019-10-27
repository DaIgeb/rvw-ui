import { Injectable } from '@angular/core';
import { LoggerService } from '@app/core/logger.service';
import { ConfigService } from '@app/core/config';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { isArray } from 'util';
import { Observable } from 'rxjs';
import {Location} from './location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  save(payload: Location | Location[]): Observable<Location | Location[]> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          if (isArray(payload)) {
            return this.http.post<Location[]>(c.locationsUrl, payload);
          } else if (payload.id) {
            return this.http.put<Location>(`${c.locationsUrl}${payload.id}`, payload);
          } else {
            return this.http.post<Location>(c.locationsUrl, payload);
          }
        })
      )
      .pipe(
        tap(i => this.logger.log('Locations save: ' + JSON.stringify(i, null, 2)))
      );
  }

  load = (): Observable<Location[]> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<Location[]>(c.locationsUrl)))
      .pipe(tap(i => this.logger.log('Locations: ' + JSON.stringify(i, null, 2))))
      ;
  }
}
