import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { ConfigService } from './config';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  uploadFile(name: string, type: string, file: File) {
    return this.configService
      .getConfig()
      .pipe(
        switchMap(c => {
          const params = new URLSearchParams();
          params.set('name', name);
          params.set('type', type);

          return this.http.post<string>(c.fileUrl, params);
        }),
        switchMap(url => {
          return this.http.put<any>(url, file, { headers: { 'Content-Type': type } });
        })
      );
  }
}
