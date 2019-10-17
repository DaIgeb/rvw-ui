import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TourEffects } from './tour.effects';
import { tourReducer } from './tour.reducer';
import { CdkTableModule } from '@angular/cdk/table';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { TourListComponent } from './tour-list/tour-list.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TourListComponent, TourEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TourRoutingModule,
    CdkTableModule,
    AppMaterialModule,
    StoreModule.forFeature('tour', tourReducer),
    EffectsModule.forFeature([TourEffects])
  ]
})
export class TourModule { }
