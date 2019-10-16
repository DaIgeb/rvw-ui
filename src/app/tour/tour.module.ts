import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TourEffects } from './tour.effects';
import { tourReducer } from './tour.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TourRoutingModule,
    StoreModule.forFeature('tour', tourReducer),
    EffectsModule.forFeature([TourEffects])
  ]
})
export class TourModule { }
