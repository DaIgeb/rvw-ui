import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './log.pipe';
import { ChartComponent } from './chart/chart.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExportComponent } from './export/export.component';

@NgModule({
  declarations: [LogPipe, ChartComponent, ExportComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    AppMaterialModule
  ],
  exports: [LogPipe, ChartComponent, ExportComponent]
})
export class SharedModule {}
