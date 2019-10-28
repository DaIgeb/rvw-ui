import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { locationReducer } from './location.reducer';
import { LocationEffects } from './location.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [LocationListComponent, LocationEditComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    LocationRoutingModule,
    SharedModule,
    StoreModule.forFeature('location', locationReducer),
    EffectsModule.forFeature([LocationEffects])
  ]
})
export class LocationModule { }
