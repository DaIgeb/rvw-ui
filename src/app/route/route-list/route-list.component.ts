import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { merge, of as observableOf, Observable, timer, combineLatest } from 'rxjs';
import { startWith, switchMap, map, catchError, delay, debounce } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectRouteRoutes } from '../../core/route/route.selectors';
import { Route } from '@app/core/route/route.model';
import {
  ActionRouteLoad,
  ActionRouteSave
} from '@app/core/route/route.actions';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import * as papa from 'papaparse';
import { LoggerService } from '@app/core/logger.service';
import { TableService } from '@app/shared/table.service';

@Component({
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'elevation', 'distance', 'action'];

  data: Route[] = [];
  data$: Observable<Route[]>;

  private filter = new FormControl('');
  private filter$: Observable<string>;

  formGroup = new FormGroup({
    filter: this.filter
  });

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  currentSort: Sort;
  currentPage: PageEvent;

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private logger: LoggerService,
    private tableService: TableService
  ) { }

  ngOnInit() {
    this.store.dispatch(new ActionRouteLoad());

    this.filter$ = this.filter.valueChanges.pipe(
      startWith(''),
      debounce(() => timer(500)),
      map(s => s.toLocaleLowerCase())
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    this.data$ = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        delay(0),
        switchMap(s => {
          if (this.tableService.isPage(s)) {
            this.currentPage = s;
          }
          if (this.tableService.isSort(s)) {
            this.currentSort = s;
          }

          this.isLoadingResults = true;

          return combineLatest([
            this.store.select(selectRouteRoutes),
            this.filter$
          ]).pipe(
            map(data => data[0].filter(i => i.name.toLocaleLowerCase().indexOf(data[1]) !== -1))
          );
        }));
    this.data$.pipe(
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.length;

        return this.tableService.applyPaging(
          this.tableService.applySort(data, this.currentSort || {
            active: 'firstName',
            direction: 'asc'
          }),
          this.currentPage
        );
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    )
      .subscribe(data => (this.data = data));
  }

  editRoute(id: string) {
    this.route.navigate([`${id}/edit`]);
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csv = papa.parse(e.target.result, { header: true });

        if (csv.errors && csv.errors.length > 0) {
          this.logger.error(JSON.stringify(csv.errors, null, 2));
        } else {
          const nameField = csv.meta.fields.find(s => s.startsWith('name'));
          const distanceField = csv.meta.fields.find(s =>
            s.startsWith('distance')
          );
          const elevationField = csv.meta.fields.find(s =>
            s.startsWith('elevation')
          );

          this.store.dispatch(
            new ActionRouteSave(
              csv.data.map(d => ({
                name: d[nameField],
                distance: parseInt(d[distanceField], 10),
                elevation: parseInt(d[elevationField], 10)
              }))
            )
          );
        }
      };

      reader.readAsText(inputNode.files[0]);
    }
  }
}
