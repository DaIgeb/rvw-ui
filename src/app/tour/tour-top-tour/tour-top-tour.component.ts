import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, Sort, PageEvent } from '@angular/material';
import { Observable, of, combineLatest, merge } from 'rxjs';
import { Member } from '@app/core/member/member.model';
import { Tour } from '../tour.model';
import { LoggerService } from '@app/core/logger.service';
import { TableService } from '@app/shared/table.service';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActionTourLoad } from '../tour.actions';
import { ActionMemberLoad } from '@app/core/member/member.actions';
import { ActionRouteLoad } from '@app/core/route/route.actions';
import { map, startWith, delay, switchMap, catchError } from 'rxjs/operators';
import { selectTourYear, selectTourTours } from '../tour.selectors';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { Route } from '@app/core/route/route.model';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offlineExporting from 'highcharts/modules/offline-exporting';
import HC_exportData from 'highcharts/modules/export-data';
HC_exporting(Highcharts);
HC_offlineExporting(Highcharts);
HC_exportData(Highcharts);
highcharts3D(Highcharts);

type TData = Tour & { participantCount: number };

@Component({
  selector: 'rvw-tour-top-tour',
  templateUrl: './tour-top-tour.component.html',
  styleUrls: ['./tour-top-tour.component.scss']
})
export class TourTopTourComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      type: 'column',
      margin: 75,
      options3d: {
        enabled: true,
        alpha: 20,
        beta: 20,
        depth: 50,
        viewDistance: 25
      }
    },
    title: {
      text: 'Top Participants'
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
    yAxis: {
      title: {
        text: ''
      }
    },
    exporting: {
      allowHTML: true,
      sourceWidth: 800,
      sourceHeight: 320
    },
    series: [
      {
        type: 'column',
        name: 'Top Participants',
        showInLegend: false,
        data: [] as number[]
      }
    ],
    credits: {
      enabled: false
    }
  }; // required

  private chart: Chart;

  routes$: Observable<{ [index: string]: Route }>;
  tours$: Observable<Tour[]>;

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionRouteLoad());

    this.tours$ = combineLatest([
      this.store.select(selectTourYear),
      this.store.select(selectTourTours)
    ]).pipe(
      map(data => {
        const year = data[0];
        return data[1].filter(item => item.date.startsWith(year.toString()));
      })
    );

    this.routes$ = this.store.select(selectRouteRoutes).pipe(
      map(data =>
        data.reduce(
          (arr, item) => {
            arr[item.id] = item;
            return arr;
          },
          {} as { [index: string]: Route }
        )
      )
    );

    combineLatest([this.tours$, this.routes$])
      .pipe(
        map(
          data =>
            this.tableService.applyPaging(
              this.tableService.applySort(
                data[0].map(
                  t =>
                    ({
                      ...t,
                      route: `${(data[1][t.route] || { name: '' }).name} (${
                        t.date
                      })`,
                      participantCount: t.participants.length
                    } as TData)
                ),
                undefined,
                'participantCount'
              ),
              undefined,
              10
            ) || []
        ),
        map(
          data =>
            ({
              ...this.chartOptions,
              xAxis: {
                ...this.chartOptions.xAxis,
                categories: data.map(d => d.route)
              },
              series: [
                {
                  ...this.chartOptions.series[0],
                  data: data.map(d => d.participantCount)
                }
              ]
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
}
