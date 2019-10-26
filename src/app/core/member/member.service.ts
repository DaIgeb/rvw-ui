import { Injectable } from '@angular/core';
import { of, Observable, forkJoin, concat } from 'rxjs';
import { Member } from './member.model';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@app/core/logger.service';
import { ConfigService } from '@app/core/config';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) {}

  save(payload: Member | Member[]): Observable<Member | Member[]> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          if (isArray(payload)) {
            const newItems = payload.filter(i => !i.id);
            const updatedItems = payload.filter(i => i.id);

            return concat(
              newItems.length > 0
                ? this.http.post<Member[]>(c.membersUrl, newItems)
                : of([] as Member[]),
              updatedItems.length > 0
                ? forkJoin(
                    updatedItems.map(i =>
                      this.http.put<Member>(`${c.membersUrl}${i.id}`, i)
                    )
                  )
                : of([] as Member[])
            );
          } else if (payload.id) {
            return this.http.put<Member>(
              `${c.membersUrl}${payload.id}`,
              payload
            );
          } else {
            return this.http.post<Member>(c.membersUrl, payload);
          }
        })
      )
      .pipe(
        tap(i => this.logger.log('Members save: ' + JSON.stringify(i, null, 2)))
      );
  }

  load = (): Observable<Member[]> => {
    return this.configService
      .getConfig()
      .pipe(switchMap(c => this.http.get<Member[]>(c.membersUrl)))
      .pipe(
        tap(i => this.logger.log('Members: ' + JSON.stringify(i, null, 2)))
      );
  };
}
