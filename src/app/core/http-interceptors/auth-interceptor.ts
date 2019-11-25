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
import { LoggerService } from '../logger.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private logger: LoggerService) {}
  // function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // how to update the request Parameters
    if (!request.url.startsWith('https://rvw-files-v1.s3') && request.url.startsWith('https://') && this.auth.authenticated) {
      return this.auth.getToken().pipe(
        switchMap(t => {
          const updatedRequest = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + t)
          });
          // logging the updated Parameters to browser's console
          this.logger.log(
            'Before making api call : ' +
              JSON.stringify(updatedRequest, null, 2),
            'debug'
          );
          return next.handle(updatedRequest).pipe(
            tap(
              event => {
                // logging the http response to browser's this.logger in case of a succe, 'debug'ss
                if (event instanceof HttpResponse) {
                  this.logger.log(
                    'api call success :' + JSON.stringify(event, null, 2),
                    'debug'
                  );
                }
              },
              error => {
                // logging the http response to browser's this.logger in case of a failu, 'debug'er
                if (error instanceof HttpResponse) {
                  this.logger.log(
                    'api call error :' + JSON.stringify(error, null, 2),
                    'debug'
                  );
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
