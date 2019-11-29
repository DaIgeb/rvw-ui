import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { selectTourPlanerState } from '../tour-planer.selectors';
import { ActionTourPlanerLoad } from '../tour-planer.actions';
import { IList } from 'rvw-model/lib/season';
import { Observable, timer, merge, combineLatest, of } from 'rxjs';
import { MatPaginator, MatSort, Sort, PageEvent } from '@angular/material';
import { TableService } from '@app/shared/table.service';
import { startWith, debounce, map, delay, switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'rvw-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['year', 'seasonStart', 'seasonEnd', 'action'];

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
  
  data$: Observable<IList[]>;
  data: IList[];

  constructor(
    private store: Store<AppState>,
    private tableService: TableService,
  ) { }

  ngOnInit() {
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
            this.store.select(selectTourPlanerState).pipe(
              tap(s => {
                if (!s.loaded && !s.loading) {
                  this.store.dispatch(new ActionTourPlanerLoad())
                }        
              }),
              map(s => s.list)),
            this.filter$
          ]).pipe(
            map(data => data[0].filter(i => i.year.toString().toLocaleLowerCase().indexOf(data[1]) !== -1))
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
            active: 'year',
            direction: 'asc'
          }),
          this.currentPage
        );
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return of([]);
      })
    )
      .subscribe(data => (this.data = data));
  }
}
