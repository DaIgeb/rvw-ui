import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Route } from './route.model';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@app/core/logger.service';
import { ConfigService } from '@app/core/config';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private logger: LoggerService, private configService: ConfigService, private http: HttpClient) { }

  load = () : Observable<Route[]> => {
    return this.configService.getConfig()
      .pipe(switchMap(c => this.http.get<Route[]>(c.routesUrl)))
      .pipe(tap(i => this.logger.log('Routes: ' + JSON.stringify(i, null, 2))));
  }
}
