import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {CdkTableModule} from '@angular/cdk/table';

import { RouteRoutingModule } from './route-routing.module';
import { RouteListComponent } from './route-list/route-list.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { routeReducer } from './route.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RouteEffects } from './route.effects';
import { RouteEditComponent } from './route-edit/route-edit.component';

@NgModule({
  declarations: [RouteListComponent, RouteEditComponent],
  imports: [
    CommonModule,
    RouteRoutingModule,
    CdkTableModule,
    AppMaterialModule,
    StoreModule.forFeature('route', routeReducer),
    EffectsModule.forFeature([RouteEffects])
  ]
})
export class RouteModule { }
