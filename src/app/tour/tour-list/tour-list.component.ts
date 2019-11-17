import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, of, combineLatest, timer } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators/catchError';
import {
  map,
  startWith,
  switchMap,
  tap,
  delay,
  debounce
} from 'rxjs/operators';
import { selectTourTours, selectTourListSort } from '../tour.selectors';
import { Tour } from '../tour.model';
import { ActionTourLoad, ActionTourSaveListSort } from '../tour.actions';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { Member } from '@app/core/member/member.model';
import { selectRouteRoutes } from '@app/core/route/route.selectors';
import { ActionMemberLoad } from '@app/core/member/member.actions';
import { IList as Route } from 'rvw-model/lib/route';
import { ActionRouteLoad } from '@app/core/route/route.actions';
import { TableService } from '@app/shared/table.service';

@Component({
  selector: 'rvw-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'route',
    'points',
    'date',
    'participants',
    'action'
  ];

  data: Tour[] = [];
  data$: Observable<Tour[]>;

  private sort$: Observable<Sort[]>;
  private filter = new FormControl('');
  private filter$: Observable<string>;

  formGroup = new FormGroup({
    filter: this.filter
  });

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentSort: Sort | undefined;
  currentPage: PageEvent;

  baseTourUrl: string;

  constructor(
    private store: Store<AppState>,
    private logger: LoggerService,
    private tableService: TableService,
    private router: Router
  ) {
    if (this.router.url.endsWith("list")) {
      this.baseTourUrl = '..';
    }
    else {
      this.baseTourUrl = '.';
    }
  }

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
    this.store.dispatch(new ActionMemberLoad());
    this.store.dispatch(new ActionRouteLoad());

    this.sort$ = this.store.select(selectTourListSort);

    this.sort$.subscribe(s => {
      if (
        this.sort.active !== s[0].active ||
        this.sort.direction !== s[0].direction
      ) {
        this.sort.sort({
          id: s[0].active,
          start: s[0].direction || 'asc',
          disableClear: true
        });
      }
    });

    this.filter$ = this.filter.valueChanges.pipe(
      startWith(''),
      debounce(() => timer(500)),
      map(s => s.toLocaleLowerCase())
    );
  }

  ngAfterViewInit() {
    const tours$ = this.store.select(selectTourTours);
    const members$ = this.store.select(selectMemberMembers).pipe(
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

    this.sort.sortChange
      .pipe(tap(s => this.store.dispatch(new ActionTourSaveListSort(s))))
      .subscribe(() => this.paginator.firstPage());
    this.paginator.page
      .pipe(
        startWith({}),
        delay(0),
        switchMap(s => {
          if (this.tableService.isPage(s)) {
            this.currentPage = s;
          }

          this.isLoadingResults = true;
          const combineData = combineLatest([tours$, members$, routes$]).pipe(
            map(data =>
              data[0].map(item => ({
                ...item,
                route:
                  item.route && data[2][item.route]
                    ? data[2][item.route].name
                    : '',
                participants: (item.participants || []).map(id => {
                  const participant = data[1][id];

                  if (participant) {
                    return `${participant.lastName} ${participant.firstName}`;
                  }

                  return '';
                })
              }))
            )
          );
          const filteredData = combineLatest([combineData, this.filter$]).pipe(
            map(data =>
              data[0].filter(
                i =>
                  i.date.toLocaleLowerCase().indexOf(data[1]) !== -1 ||
                  i.route.toLocaleLowerCase().indexOf(data[1]) !== -1 ||
                  i.participants.some(
                    p => p.toLocaleLowerCase().indexOf(data[1]) !== -1
                  )
              )
            )
          );
          return combineLatest([filteredData, this.sort$]).pipe(
            map(data => this.tableService.applySort(data[0], data[1]) || [])
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          return this.tableService.applyPaging(data, this.currentPage);
        }),
        catchError(err => {
          this.logger.error(err);
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => (this.data = data));
  }
}
