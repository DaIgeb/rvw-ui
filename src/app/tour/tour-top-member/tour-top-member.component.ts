import { Component, OnInit } from '@angular/core';
import { ActionTourLoad } from '../tour.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { ActionMemberLoad } from '@app/core/member/member.actions';
import { ActionRouteLoad, ActionRouteLoadDetail } from '@app/core/route/route.actions';
import { selectTourTours, selectTourYear } from '../tour.selectors';
import { map, tap, switchMap } from 'rxjs/operators';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { selectRouteRoutes, selectRoute, selectCurrentRouteDetailState } from '@app/core/route/route.selectors';
import { combineLatest, Observable } from 'rxjs';
import { IDetail as IRouteDetail } from 'rvw-model/lib/route';
import { Tour } from '../tour.model';
import * as moment from 'moment';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

interface Data {
  display: string;
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  isActive: boolean;
  isGuest: boolean;
  gender?: 'female' | 'male' | 'unknown';
  distance: number;
  elevation: number;
  tourCount: number;
  points: number;
}

@Component({
  selector: 'rvw-tour-top-member',
  templateUrl: './tour-top-member.component.html',
  styleUrls: ['./tour-top-member.component.scss']
})
export class TourTopMemberComponent implements OnInit {

  columns = [
    { name: 'Points', column: 'points' },
    { name: 'Tours', column: 'tourCount' },
    { name: 'Distance', column: 'distance' },
    { name: 'Elevation', column: 'elevation' }
  ];

  aggregatedData$: Observable<Data[]>;
  aggregatedData: Data[];

  constructor(
    private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionMemberLoad());
    this.store.dispatch(new ActionRouteLoad());

    const tours$ = combineLatest([
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
    
    const routes$ = tours$.pipe(
      map(tours => tours.tours.reduce((prev, cur) => ([
        ...prev,
        cur.route
      ]), [] as string[])),
      switchMap(routes => combineLatest(routes.map(r => this.store.select(selectCurrentRouteDetailState(r))))),
      tap(routes => console.log(routes)),
      tap(routes => routes.filter(r => !r.loaded && !r.loading).forEach(t => this.store.dispatch(new ActionRouteLoadDetail(t.id)))),
      map(routes => routes
        .filter(r => r.item)
        .reduce((prev, cur) => {
          prev[cur.id] = cur.item;
          return prev;
        })),
      tap(routes => console.log(routes))
    );

    const members$ = this.store.select(selectMemberMembers);
    this.aggregatedData$ = combineLatest([
      tours$,
      members$,
      routes$
    ]).pipe(
      map(data => {
        const toursByMember = data[0].tours.reduce(
          (prev, cur) => {
            cur.participants.forEach(
              p => (prev[p] = [...(prev[p] || []), {
                ...cur, r2: data[2][cur.route] || {
                  id: cur.route,
                  type: 'route',
                  name: '',
                  timelines: [{
                    from: '1900-01-01',
                    distance: 0,
                    elevation: 0,
                    locations: []
                  }]
                }
              }])
            );

            return prev;
          },
          {} as { [index: string]: (Tour & { r2: IRouteDetail })[] }
        );

        return data[1].map(m => {
          const tours = toursByMember[m.id] || [];
          return ({
            display: `${m.lastName} ${m.firstName}`,
            firstName: m.firstName,
            lastName: m.lastName,
            email: m.email,
            address: m.address,
            zipCode: m.zipCode,
            city: m.city,
            isGuest: m.membership.length === 0,
            isActive: m.membership.some(ms => moment(ms.from).isBefore(moment()) && (!ms.to || moment(ms.to).isAfter(moment()))),
            tourCount: (tours).length,
            points: (tours).reduce((prev, cur) => prev + cur.points, 0),
            distance: tours.reduce((prev, cur) => prev + cur.r2.timelines[0].distance, 0),
            elevation: tours.reduce((prev, cur) => prev + cur.r2.timelines[0].elevation, 0)
          });
        });
      })
    );
  }
}
