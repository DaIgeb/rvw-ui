import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Papa from 'papaparse';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offlineExporting from 'highcharts/modules/offline-exporting';
import HC_exportData from 'highcharts/modules/export-data';
import { startWith, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { TableService } from '../table.service';
import { Sort } from '@angular/material/sort';

HC_exporting(Highcharts);
HC_offlineExporting(Highcharts);
HC_exportData(Highcharts);
highcharts3D(Highcharts);

interface Data {
  display: string;
  [index: string]: any;
}

@Component({
  selector: 'rvw-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      type: 'column',
      margin: 75
    },
    plotOptions: {
      column: {
        depth: 25
      }
    },
    xAxis: {
      categories: [] as string[],
      crosshair: true
    },
    legend: {
      align: 'left',
      layout: 'vertical'
    },
    exporting: {
      allowHTML: true,
      sourceWidth: 800,
      sourceHeight: 320
    },
    series: [],
    credits: {
      enabled: false
    }
  }; // required

  sortOrder = new FormControl('points');

  formGroup = new FormGroup({ sortOrder: this.sortOrder });

  @Input()
  data: Observable<Data[]>;

  @Input()
  title: string;

  @Input()
  type?= 'column';

  @Input()
  enable3d?= true;

  @Input()
  columns: { name: string; column: string; }[] = [];

  aggregatedData: Data[];

  private chart: Chart;

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.data.subscribe(data => this.aggregatedData = data);
    const sortOrder$: Observable<string> = this.sortOrder.valueChanges.pipe(
      startWith(this.columns[0].column),
      map(item => item)
    );

    this.sortOrder.patchValue(this.columns[0].column);

    const data$ = combineLatest([this.data, sortOrder$]);

    data$
      .pipe(
        map(
          data =>
            this.tableService.applyPaging(
              this.tableService.applySort(data[0], [
                { active: data[1], direction: 'desc' },
                ...this.columns.map(c => ({ active: c, direction: 'desc' }))
              ] as Sort[]),
              undefined,
              10
            ) || []
        ),
        map(
          data =>
            ({
              ...this.chartOptions,
              chart: {
                ...this.chartOptions.chart,
                type: this.type,
                options3d: this.enable3d ? {
                  enabled: true,
                  alpha: 20,
                  beta: 20,
                  depth: 50,
                  viewDistance: 25
                } : {}
              },
              title: {
                text: this.title
              },
              yAxis: this.columns.map(c => ({
                title: {
                  text: ''
                }
              })),
              xAxis: {
                ...this.chartOptions.xAxis,
                categories: data.map(d => d.display)
              },
              series: this.columns.map((c, i) => ({
                type: this.type,
                name: c.name,
                yAxis: i,
                data: data.map(d => d[c.column])
              }))
            } as Highcharts.Options)
        )
      )
      .subscribe(data => {
        if (this.chart) {
          this.chart.showLoading();
        }

        this.chartOptions = data;

        if (this.chart) {
          this.chart.hideLoading();
        }
      });

  }

  chartCallback(chart: Chart) {
    this.chart = chart;
  }

  exportAll() {
    const content = Papa.unparse(this.aggregatedData, {});

    const dynamicDownload = document.createElement('a');
    const element = dynamicDownload;
    const fileType = 'text/csv';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', 'data.csv');

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
