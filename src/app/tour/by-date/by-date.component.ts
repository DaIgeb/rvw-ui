import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActionTourLoad } from '../tour.actions';
import { combineLatest, Observable } from 'rxjs';
import { selectTourYear, selectTourTours } from '../tour.selectors';
import { Tour } from '../tour.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { ActionRouteLoad, ActionRouteLoadDetail } from '@app/core/route/route.actions';
import { selectRouteRoutes, selectCurrentRouteDetailState } from '@app/core/route/route.selectors';
import { IDetail as IRouteDetail } from 'rvw-model/lib/route';

type TData = Tour & {
  distance: number;
  elevation: number;
  participantCount: number;
  display: string
};
@Component({
  selector: 'rvw-by-date',
  templateUrl: './by-date.component.html',
  styleUrls: ['./by-date.component.scss']
})
export class ByDateComponent implements OnInit {
  aggregatedData$: Observable<TData[]>;

  columns = [
    { name: 'Date', column: 'date' },
    { name: 'Elevation', column: 'elevation' },
    { name: 'Distance', column: 'distance' },
    { name: 'Participants', column: 'participantCountr' }
  ];

  constructor(private store: Store<AppState>) { }

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
        ).sort((a, b) => a.date.localeCompare(b.date)) as Tour[];
      })
    );

    const routes$ = tours$.pipe(
      map(tours => tours.reduce((prev, cur) => ([
        ...prev,
        cur.route
      ]), [] as string[])),
      tap(routes => routes.forEach(t => this.store.dispatch(new ActionRouteLoadDetail(t)))),
      switchMap(routes => combineLatest(routes.map(r => this.store.select(selectCurrentRouteDetailState(r))))),
      tap(routes => console.log(routes)),
      map(routes => routes
        .filter(r => r && r.item)
        .reduce((prev, cur) => {
          prev[cur.item.id] = cur.item;
          return prev;
        }, {})),
      tap(routes => console.log(routes))
    );

    this.aggregatedData$ = combineLatest([
      tours$,
      routes$,
    ]).pipe(
      map(data => {
        return data[0].map(t => {
          const route = data[1][t.route] || {
            timelines: [{
              from: '1900-01-01',
              distance: 0,
              elevation: 0
            }]
          };
          return {
            ...t,
            display: t.date,
            distance: t.participants.length * (route ? route.timelines[0].distance : 0),
            elevation: t.participants.length * (route ? route.timelines[0].elevation : 0),
            participantCount: t.participants.length
          } as TData;
        });
      })
    );
  }

}
