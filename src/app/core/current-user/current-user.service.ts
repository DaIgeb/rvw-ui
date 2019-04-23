import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from './current-user.models';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor() {}

  getCurrentUser(): Observable<User> {
    return of({ roles: ['admin'] });
  }
}
