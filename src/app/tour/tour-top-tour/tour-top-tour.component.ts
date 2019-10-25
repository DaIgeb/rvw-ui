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
import { map, startWith, delay, switchMap, catchError, tap } from 'rxjs/operators';
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
import { FormControl, FormGroup } from '@angular/forms';
import * as Papa from 'papaparse';
HC_exporting(Highcharts);
HC_offlineExporting(Highcharts);
HC_exportData(Highcharts);
highcharts3D(Highcharts);

type TData = Tour & {
  participantCount: number;
  distance: number;
  elevation: number;
  display: string;
};

@Component({
  selector: 'rvw-tour-top-tour',
  templateUrl: './tour-top-tour.component.html',
  styleUrls: ['./tour-top-tour.component.scss']
})
export class TourTopTourComponent implements OnInit {
  columns = [
    { name: 'Participants', column: 'participantCount' },
    { name: 'Distance', column: 'distance' },
    { name: 'Elevation', column: 'elevation' }
  ];

  aggregatedData$: Observable<TData[]>;

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionRouteLoad());

    const tours$ = combineLatest([
      this.store.select(selectTourYear),
      this.store.select(selectTourTours)
    ]).pipe(
      map(data => {
        const year = data[0];
        return data[1].filter(item =>
          item.date.startsWith(year.toString())
        ) as Tour[];
      })
    );

    const routes$ = this.store.select(selectRouteRoutes).pipe(
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

    this.aggregatedData$ = combineLatest([
      tours$,
      routes$,
    ]).pipe(
      map(data => {
        return data[0].map(t => {
          const route = data[1][t.route];
          return {
            ...t,
            display: route ? route.name : '',
            route: `${route ? route.name : ''} (${t.date})`,
            participantCount: t.participants.length,
            distance: t.participants.length * (route ? route.distance : 0),
            elevation: t.participants.length * (route ? route.elevation : 0)
          } as TData;
        });
      })
    );
  }
}
