import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { httpInterceptorProviders } from './http-interceptors';

import { reducers, metaReducers } from './core.state';
import { AuthEffects } from './auth/auth.effects';
import { CurrentUserEffects } from './current-user/current-user.effects';
import { EditProfileComponent } from './current-user/edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { MemberEffects } from './member/member.effects';
import { RouteEffects } from './route/route.effects';

@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppMaterialModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      AuthEffects,
      CurrentUserEffects,
      MemberEffects,
      RouteEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'RVW - Apps'
      }),
    StoreRouterConnectingModule.forRoot()
  ],
  exports: [EditProfileComponent],
  providers: [httpInterceptorProviders]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
