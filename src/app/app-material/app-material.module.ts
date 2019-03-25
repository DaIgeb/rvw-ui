import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';

import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
  ]
})
export class AppMaterialModule {}
