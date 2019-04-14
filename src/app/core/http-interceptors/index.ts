import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpAuthInterceptor } from './auth-interceptor';
import { HttpLoggingInterceptor } from './logging-interceptors';
import { HttpErrorInterceptor } from './http-error.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpLoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
