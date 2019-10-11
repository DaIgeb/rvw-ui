import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, of as observableOf, Observable } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectRouteRoutes } from '../route.selectors';
import { Route } from '../route.model';
import { ActionRouteLoad } from '../route.actions';

@Component({
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'elevation', 'distance', 'name'];

  data: Route[] = [];
  data$: Observable<Route[]>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new ActionRouteLoad());
    this.store.select(selectRouteRoutes).subscribe(data => this.data = data);
    /*this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.store.select(selectRouteRoutes);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));*/
  }
}
