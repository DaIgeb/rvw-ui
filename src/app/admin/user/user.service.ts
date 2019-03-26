import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/core/config.service';
import { tap, switchMap, debounce } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getUsers(): Observable<any[]> {
    const observable = this.configService.getConfig();

    return observable.pipe(switchMap(c => this.http.get<any[]>(c.usersUrl)));
  }
}
