import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de-CH';
import localeDeChExtra from '@angular/common/locales/extra/de-CH';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AppMaterialModule } from './app-material/app-material.module';

registerLocaleData(localeDeCh, 'de-CH', localeDeChExtra);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    AppMaterialModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
