import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/config';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoggerService } from '@app/core/logger.service';
import { IList } from 'rvw-model/lib/season';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TourPlanerService {

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private http: HttpClient) { }

  load = (): Observable<IList[]> => {
    return of([]);
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<IList[]>(c.seasonsUrl)))
      .pipe(tap(i => this.logger.log('Seasons: ' + JSON.stringify(i, null, 2))));
  }

  save = (season: IList): Observable<IList> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.post<IList>(c.seasonsUrl, season)))
      .pipe(tap(i => this.logger.log('Seasons: ' + JSON.stringify(i, null, 2))));
  }
}
