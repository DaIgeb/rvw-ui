import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf, Observable } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectRouteRoutes } from '../route.selectors';
import { Route } from '../route.model';
import { ActionRouteLoad, ActionRouteSave } from '../route.actions';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as papa from 'papaparse';
import { Input } from '@angular/compiler/src/core';
import { LoggerService } from '@app/core/logger.service';

@Component({
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'elevation', 'distance', 'action'];

  data: Route[] = [];
  data$: Observable<Route[]>;

  fileControl = new FormControl();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionRouteLoad());
    this.store.select(selectRouteRoutes).subscribe(data => (this.data = data));
  }

  ngAfterViewInit() {
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

  uploadFile() {
    console.log(this.fileControl.value);
  }
}
