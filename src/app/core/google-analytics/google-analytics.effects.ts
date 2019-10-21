import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { createEffect } from '@ngrx/effects';
import { tap, filter } from 'rxjs/operators';

@Injectable()
export class GoogleAnalyticsEffects {
  constructor(private router: Router) {}

  pageView = createEffect(
    () => () =>
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          (<any>window).gtag('set', 'page', event.urlAfterRedirects);
          (<any>window).gtag('send', 'pageview');
        })
      ),
    { dispatch: false }
  );
}
