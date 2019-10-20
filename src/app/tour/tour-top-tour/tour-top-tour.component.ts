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
highcharts3D(Highcharts);

type TData = Tour & { participantCount: number };

@Component({
  selector: 'rvw-tour-top-tour',
  templateUrl: './tour-top-tour.component.html',
  styleUrls: ['./tour-top-tour.component.scss']
})
export class TourTopTourComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'route',
    'date',
    'points',
    'participantCount'
  ];

  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      type: 'column',
      margin: 75,
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25
      }
    },
    title: {
      text: 'Top Tours'
    },
    plotOptions: {
      column: {
        depth: 25
      }
    },
    series: [
      { data: [] }
    ]
  }; // required

  private chart: Chart;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentSort: Sort | undefined;
  currentPage: PageEvent;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  routes$: Observable<{ [index: string]: Route }>;
  tours$: Observable<Tour[]>;
  members$: Observable<{ [index: string]: Member }>;
  data: TData[];

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionMemberLoad());
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
    this.members$ = this.store.select(selectMemberMembers).pipe(
      map(data =>
        data.reduce(
          (arr, item) => {
            arr[item.id] = item;
            return arr;
          },
          {} as { [index: string]: Member }
        )
      )
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
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());
    merge<Sort, PageEvent>(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        delay(0),
        switchMap(s => {
          if (this.tableService.isSort(s)) {
            this.currentSort = s;
          } else if (this.tableService.isPage(s)) {
            this.currentPage = s;
          }

          this.isLoadingResults = true;
          return combineLatest([this.tours$, this.members$, this.routes$]).pipe(
            map(data =>
              data[0].map(
                t =>
                  ({
                    ...t,
                    route: (data[2][t.route] || { name: '' }).name,
                    participantCount: t.participants.length,
                    participants: t.participants.map(
                      p => {
                        const participant = data[1][p] || { lastName: '', firstName: '' };
                        return `${participant.lastName} ${participant.firstName}`;
                      }
                    )
                  } as TData)
              )
            )
          );
        }),
        map((data: TData[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          return this.tableService.applyPaging(
            this.tableService.applySort(data, this.currentSort, 'participantCount'),
            this.currentPage
          );
        }),
        catchError(err => {
          this.logger.error(err);
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => {
        if (this.chart) {
          this.chart.showLoading();
        }
        if (data) {
          this.chartOptions = {
            ...this.chartOptions,
            series: [
              {
                data: data.map(d => d.participantCount)
              }
            ]
          };
        }
        if (this.chart) {
          this.chart.hideLoading();
        }
        return this.data = data;

      });
  }

  chartCallback(chart: Chart) {
    console.error(chart);
    this.chart = chart;
  }
}
