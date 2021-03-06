import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { combineLatest, of, Observable, timer, merge } from 'rxjs';
import {
  map,
  catchError,
  startWith,
  delay,
  switchMap,
  debounce,
  tap
} from 'rxjs/operators';
import { MatPaginator, MatSort, Sort, PageEvent } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { TableService } from '@app/shared/table.service';
import { ActionLocationLoad, ActionLocationSave } from '../location.actions';
import { selectLocationAll, selectLocationIsLoaded } from '../location.selectors';
import { Detail, IList as Location } from 'rvw-model/lib/location';
import { ParseResult } from 'papaparse';
import * as papa from 'papaparse';

@Component({
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'type', 'action'];

  data: Location[] = [];
  locations$: Observable<Location[]>;

  private filter = new FormControl('');
  private filter$: Observable<string>;

  formGroup = new FormGroup({
    filter: this.filter
  });

  resultsLength = 0;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentSort: Sort | undefined;
  currentPage: PageEvent;
  locationsLoaded$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private logger: LoggerService,
    private tableService: TableService
  ) { }

  ngOnInit() {
    this.locationsLoaded$ = this.store.select(selectLocationIsLoaded);
    this.locationsLoaded$
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(new ActionLocationLoad())
        }
      });

    this.filter$ = this.filter.valueChanges.pipe(
      startWith(''),
      debounce(() => timer(500)),
      map(s => s.toLocaleLowerCase())
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());

    const locations$ = this.store.select(selectLocationAll);
    
    this.locations$ = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        delay(0),
        switchMap(s => {
          if (this.tableService.isSort(s)) {
            this.currentSort = s;
          } else if (this.tableService.isPage(s)) {
            this.currentPage = s;
          }

          return combineLatest([locations$, this.filter$]).pipe(
            map(data =>
              data[0].filter(
                i =>
                  i.name.toLocaleLowerCase().indexOf(data[1]) !== -1 ||
                  (i.address || '').toLocaleLowerCase().indexOf(data[1]) !== -1
              )
            )
          );
        }));
    this.locations$.pipe(
      map(data => {
        this.resultsLength = data.length;

        const sortedData = this.tableService.applySort(
          data,
          this.currentSort || {
            active: 'firstName',
            direction: 'asc'
          }
        );

        return this.tableService.applyPaging(sortedData, this.currentPage);
      }),
      catchError(err => {
        this.logger.error(err);
        return of([]);
      })
    )
      .subscribe(data => (this.data = data));
  }

  private parseFile(
    inputNode: HTMLInputElement,
    includeId: boolean,
    handleContent: (csv: Detail[]) => void
  ) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (inputNode.files[0].type === 'application/json') {
          let data = JSON.parse(e.target.result) as Detail[];

          if (!includeId) {
            data = data.map(d => {
              const { id, ...rest } = d;

              return rest as Detail;
            });
          }

          handleContent(data);
        }
        else {
          const csv = papa.parse(e.target.result, { header: true });

          if (csv.errors && csv.errors.length > 0) {
            this.logger.error(JSON.stringify(csv.errors, null, 2));
          } else {
            handleContent(this.map(csv, includeId));
          }
        }
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  onUpdateFileSelected() {
    const inputNode = document.querySelector<HTMLInputElement>('#updateFile');

    this.parseFile(inputNode, true, csv =>
      this.store.dispatch(new ActionLocationSave(csv))
    );
  }

  onCreateFileSelected() {
    const inputNode = document.querySelector<HTMLInputElement>('#createFile');

    this.parseFile(inputNode, false, csv =>
      this.store.dispatch(new ActionLocationSave(csv))
    );
  }

  private map(csv: ParseResult, includeId: boolean): Detail[] {
    const headers = this.parseHeader(csv);

    return csv.data.map(
      d =>
        ({
          id: includeId ? d[headers.idField] : undefined,
          name: d[headers.nameField],
          identifier: d[headers.identifierField],
          type: d[headers.typeField],
          address: d[headers.addressField]
            ? d[headers.addressField]
            : undefined,
          zipCode: d[headers.zipCodeField]
            ? d[headers.zipCodeField]
            : undefined,
          city: d[headers.cityField] ? d[headers.cityField] : undefined,
          longitude: d[headers.longitudeField],
          latitude: d[headers.latitudeField]
        } as Detail)
    );
  }

  private parseHeader(csv: ParseResult) {
    return {
      idField: csv.meta.fields.find(s => s.startsWith('id')),
      nameField: csv.meta.fields.find(s => s.startsWith('name')),
      identifierField: csv.meta.fields.find(s => s.startsWith('identifier')),
      typeField: csv.meta.fields.find(s => s.startsWith('type')),
      addressField: csv.meta.fields.find(s => s.startsWith('address')),
      zipCodeField: csv.meta.fields.find(s => s.startsWith('zipCode')),
      cityField: csv.meta.fields.find(s => s.startsWith('city')),
      longitudeField: csv.meta.fields.find(s => s.startsWith('longitude')),
      latitudeField: csv.meta.fields.find(s => s.startsWith('latitude'))
    };
  }
}
