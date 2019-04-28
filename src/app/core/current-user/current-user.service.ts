import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from './current-user.models';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor() {}

  registerCurrentUser(user: User): Observable<User> {
    return of(user);
  }

  getCurrentUser(sub: string): Observable<User> {
     //return of(undefined);

    return of({
      id: 'ca23e9c6-edd1-4b28-8586-ae2bcf98f53d',
      firstName: 'Admin',
      lastName: 'Administrator',
      email: 'admin@example.org',
      sub,
      roles: ['admin']
    });
  }
}
