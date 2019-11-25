import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { ConfigService } from './config';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as parseUrl from 'url-parse';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  uploadFile(name: string, type: string, file: File): Observable<string> {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => this.http.post<{
          uploadURL: string;
        }>(c.fileUrl, { name, type })),
        map(r => r.uploadURL),
        switchMap(url => this.http.put<any>(url, file, { headers: { 'Content-Type': type } })
          .pipe(
            map(r => {
              const urlObj = parseUrl(url, true);

              return `${urlObj.origin}${urlObj.pathname}`;
            }),
            catchError(err => of(''))
          ))
      );
  }
}
