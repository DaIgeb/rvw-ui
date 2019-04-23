import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { httpInterceptorProviders } from './http-interceptors';

// import { GoogleAnalyticsEffects } from './google-analytics/google-analytics.effects';

import { reducers, metaReducers } from './core.state';
import { AuthEffects } from './auth/auth.effects';
import { CurrentUserEffects } from './current-user/current-user.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    // StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthEffects,
      CurrentUserEffects
      //  GoogleAnalyticsEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'RVW - Apps'
        })
  ],
  providers: [httpInterceptorProviders]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
