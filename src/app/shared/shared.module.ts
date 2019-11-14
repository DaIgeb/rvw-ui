import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogPipe } from './log.pipe';
import { ChartComponent } from './chart/chart.component';
import { AppMaterialModule } from '@app/app-material/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExportComponent } from './export/export.component';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';

@NgModule({
  declarations: [LogPipe, ChartComponent, ExportComponent, ProgressIndicatorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    AppMaterialModule
  ],
  exports: [LogPipe, ChartComponent, ExportComponent, ProgressIndicatorComponent]
})
export class SharedModule {}
