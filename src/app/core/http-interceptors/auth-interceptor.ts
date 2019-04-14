import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  // function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // how to update the request Parameters
    if (request.url.startsWith('https://') && this.auth.authenticated) {
      return this.auth.getToken().pipe(
        switchMap(t => {
          const updatedRequest = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + t)
          });
          // logging the updated Parameters to browser's console
          console.log('Before making api call : ', updatedRequest);
          return next.handle(updatedRequest).pipe(
            tap(
              event => {
                // logging the http response to browser's console in case of a success
                if (event instanceof HttpResponse) {
                  console.log('api call success :', event);
                }
              },
              error => {
                // logging the http response to browser's console in case of a failuer
                if (event instanceof HttpResponse) {
                  console.log('api call error :', event);
                }
              }
            )
          );
        })
      );
    }

    return next.handle(request);
  }
}
