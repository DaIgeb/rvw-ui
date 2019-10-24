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
import { SharedModule } from '@app/shared/shared.module';
import { TourHomeComponent } from './tour-home/tour-home.component';
import { TourTopMemberComponent } from './tour-top-member/tour-top-member.component';
import { TourTopTourComponent } from './tour-top-tour/tour-top-tour.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ByDateComponent } from './by-date/by-date.component';

@NgModule({
  declarations: [
    TourListComponent,
    TourEditComponent,
    TourHomeComponent,
    TourTopMemberComponent,
    TourTopTourComponent,
    ByDateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TourRoutingModule,
    CdkTableModule,
    AppMaterialModule,
    HighchartsChartModule,
    SharedModule,
    StoreModule.forFeature('tour', tourReducer),
    EffectsModule.forFeature([TourEffects])
  ]
})
export class TourModule { }
