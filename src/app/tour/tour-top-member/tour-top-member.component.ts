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

type TData = Member & { tours: string; tourCount: number; points: number };

@Component({
  selector: 'rvw-tour-top-member',
  templateUrl: './tour-top-member.component.html',
  styleUrls: ['./tour-top-member.component.scss']
})
export class TourTopMemberComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'points',
    'tourCount'
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentSort: Sort | undefined;
  currentPage: PageEvent;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  routes$: Observable<{ [index: string]: Route }>;
  tours$: Observable<{ toursById: { [index: string]: Tour }; tours: Tour[] }>;
  members$: Observable<Member[]>;
  data: TData[];

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
    private logger: LoggerService
  ) {}

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
            map(data => {
              const toursByMember = data[0].tours.reduce(
                (prev, cur) => {
                  const tour = {
                    ...cur,
                    route:
                      cur.route && data[2][cur.route]
                        ? data[2][cur.route].name
                        : ''
                  };
                  tour.participants.forEach(
                    p => (prev[p] = [...(prev[p] || []), tour])
                  );

                  return prev;
                },
                {} as { [index: string]: Tour[] }
              );

              return data[1].map(m => ({
                ...m,
                tourCount: (toursByMember[m.id] || []).length,
                tours: (toursByMember[m.id] || [])
                  .map(t => `${t.route} (${t.date})`)
                  .join(','),
                points: (toursByMember[m.id] || []).reduce(
                  (prev, cur) => prev + cur.points,
                  0
                )
              }));
            })
          );
        }),
        map((data: TData[]) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          return this.tableService.applyPaging(
            this.tableService.applySort(data, this.currentSort, 'tourCount'),
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
      .subscribe(data => (this.data = data));
  }
}
