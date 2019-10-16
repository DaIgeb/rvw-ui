import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as papa from 'papaparse';
import { Observable, of, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map, startWith, switchMap } from 'rxjs/operators';
import { selectTourTours } from '../tour.selectors';
import { Tour } from '../tour.model';
import { ActionTourLoad, ActionTourSave } from '../tour.actions';

@Component({
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'action'];

  data: Tour[] = [];
  data$: Observable<Tour[]>;

  fileControl = new FormControl();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentSort: Sort | undefined;
  currentPage: PageEvent;

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.store.dispatch(new ActionTourLoad());
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.firstPage()));
    merge<Sort, PageEvent>(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap((s) => {
          const isSort = (obj: any): obj is Sort => {
            if ((obj as Sort).active) {
              return true;
            }

            return false;
          };
          const isPage = (obj: any): obj is PageEvent => {
            if ((obj as PageEvent).pageIndex !== undefined) {
              return true;
            }

            return false;
          };

          if (isSort(s)) {
            this.currentSort = s;
          } else if (isPage(s)) {
            this.currentPage = s;
          }

          this.isLoadingResults = true;
          const dataSource = this.store.select(selectTourTours);
          return dataSource;
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          const dataSource = data;
          const sortColumn = this.currentSort === undefined ? 'firstName' : this.currentSort.active;
          const sortDirection = this.currentSort === undefined ? 'asc' : this.currentSort.direction;

          dataSource.sort((a, b) => {
            if (sortColumn === 'fistName') {
              return (sortDirection === 'asc' ? 1 : -1) * a.firstName.localeCompare(b.firstName);
            }

            return 0;
          });

          if (this.currentPage) {
            const minIdx = this.currentPage.pageIndex * this.currentPage.pageSize;
            const maxIdx = this.currentPage.pageIndex * this.currentPage.pageSize + this.currentPage.pageSize;

            return dataSource.filter((_, idx) => (
              idx >= minIdx &&
              idx < maxIdx
            ));
          }

          return dataSource.filter((_, idx) => idx >= 0 && idx < 5);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => (this.data = data));
  }

  editRoute(id: string) {
    this.route.navigate([`${id}/edit`]);
  }
}
