import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localeDeCh from '@angular/common/locales/de-CH';
import localeDeChExtra from '@angular/common/locales/extra/de-CH';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { CallbackComponent } from './callback/callback.component';

import { CoreModule } from '@app/core';
import { NavigationModule } from './navigation/navigation.module';

registerLocaleData(localeDeCh, 'de-CH', localeDeChExtra);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CallbackComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppMaterialModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NavigationModule

    // StoreModule.forRoot(reducers, { metaReducers }),
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    // EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
