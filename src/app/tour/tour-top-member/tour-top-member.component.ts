import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActionTourLoad } from '../tour.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActionMemberLoad } from '@app/core/member/member.actions';
import { ActionRouteLoad } from '@app/core/route/route.actions';
import { MatPaginator, MatSort, Sort, PageEvent } from '@angular/material';
import { selectTourTours, selectTourYear } from '../tour.selectors';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { delay, map, startWith, switchMap, catchError } from 'rxjs/operators';
import { Member } from '@app/core/member/member.model';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { merge, combineLatest, of, Observable } from 'rxjs';
import { TableService } from '@app/shared/table.service';
import { Route } from '@app/core/route/route.model';
import { Tour } from '../tour.model';
import { LoggerService } from '@app/core/logger.service';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offlineExporting from 'highcharts/modules/offline-exporting';
import HC_exportData from 'highcharts/modules/export-data';
import { FormControl, FormGroup } from '@angular/forms';
HC_exporting(Highcharts);
HC_offlineExporting(Highcharts);
HC_exportData(Highcharts);
highcharts3D(Highcharts);

type TData = Member & { tours: string; tourCount: number; points: number };

@Component({
  selector: 'rvw-tour-top-member',
  templateUrl: './tour-top-member.component.html',
  styleUrls: ['./tour-top-member.component.scss']
})
export class TourTopMemberComponent implements OnInit {
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
      text: 'Top Members'
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
    yAxis: [
      {
        title: {
          text: ''
        }
      },
      {
        title: {
          text: ''
        }
      }
    ],
    legend: {
      align: 'left',
      layout: 'vertical'
    },
    exporting: {
      allowHTML: true,
      sourceWidth: 800,
      sourceHeight: 320
    },
    series: [
      {
        type: 'column',
        name: 'Top Points',
        yAxis: 0,
        data: [] as number[]
      },
      {
        type: 'column',
        name: 'Top Tours',
        yAxis: 1,
        data: [] as number[]
      }
    ],
    credits: {
      enabled: false
    }
  }; // required

  columns = [
    { name: 'Points', column: 'points' },
    { name: 'Tours', column: 'tourCount' }
  ];
  sortOrder = new FormControl('points');

  formGroup = new FormGroup({ sortOrder: this.sortOrder });

  private chart: Chart;

  tours$: Observable<{ toursById: { [index: string]: Tour }; tours: Tour[] }>;
  members$: Observable<Member[]>;

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionMemberLoad());

    this.tours$ = combineLatest([
      this.store.select(selectTourYear),
      this.store.select(selectTourTours)
    ]).pipe(
      map(data => {
        const year = data[0];
        const tours = data[1].filter(item =>
          item.date.startsWith(year.toString())
        );

        return {
          tours,
          toursById: tours.reduce(
            (arr, item) => {
              arr[item.id] = item;
              return arr;
            },
            {} as { [index: string]: Tour }
          )
        };
      })
    );
    this.members$ = this.store.select(selectMemberMembers);

    combineLatest([
      this.tours$,
      this.members$,
      this.sortOrder.valueChanges.pipe(
        startWith('points'),
        map(item => item)
      )
    ])
      .pipe(
        map(data => {
          const toursByMember = data[0].tours.reduce(
            (prev, cur) => {
              cur.participants.forEach(
                p => (prev[p] = [...(prev[p] || []), cur])
              );

              return prev;
            },
            {} as { [index: string]: Tour[] }
          );

          const aggregatedData = data[1].map(m => ({
            ...m,
            tourCount: (toursByMember[m.id] || []).length,
            points: (toursByMember[m.id] || []).reduce(
              (prev, cur) => prev + cur.points,
              0
            )
          }));

          return (
            this.tableService.applyPaging(
              this.tableService.applySort(aggregatedData, undefined, [
                data[2],
                'points',
                'tourCount'
              ]),
              undefined,
              10
            ) || []
          );
        }),
        map(
          data =>
            ({
              ...this.chartOptions,
              xAxis: {
                ...this.chartOptions.xAxis,
                categories: data.map(d => `${d.lastName} ${d.firstName}`)
              },
              series: [
                {
                  ...this.chartOptions.series[0],
                  data: data.map(d => d.points)
                },
                {
                  ...this.chartOptions.series[1],
                  data: data.map(d => d.tourCount)
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
