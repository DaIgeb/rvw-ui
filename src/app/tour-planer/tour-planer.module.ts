import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourPlanerRoutingModule } from './tour-planer-routing.module';
import { SeasonComponent } from './season/season.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { tourPlanerReducer } from './tour-planer.reducer';
import { TourPlanerEffects } from './tour-planer.effects';
import { SeasonEditComponent } from './season-edit/season-edit.component';
import { SharedModule } from '@app/shared/shared.module';
import { SeasonEventsEditComponent } from './season-events-edit/season-events-edit.component';
import { SeasonEventEditComponent } from './season-event-edit/season-event-edit.component';


@NgModule({
  declarations: [SeasonComponent, SeasonEditComponent, SeasonEventsEditComponent, SeasonEventEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TourPlanerRoutingModule,
    AppMaterialModule,
    SharedModule,
    StoreModule.forFeature('tour-planer', tourPlanerReducer),
    EffectsModule.forFeature([TourPlanerEffects])
  ]
})
export class TourPlanerModule { }
