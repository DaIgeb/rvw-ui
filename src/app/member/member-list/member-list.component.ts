import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as papa from 'papaparse';
import {
  ActionMemberSave,
  ActionMemberLoad
} from '@app/core/member/member.actions';
import { Member } from '@app/core/member/member.model';
import { Observable, of, merge, timer, combineLatest } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { Router } from '@angular/router';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { catchError } from 'rxjs/internal/operators/catchError';
import {
  map,
  startWith,
  switchMap,
  delay,
  debounce,
  filter
} from 'rxjs/operators';
import { TableService } from '@app/shared/table.service';
import { ParseResult } from 'papaparse';
import * as moment from 'moment';

interface Data extends Member {
  isGuest: boolean;
  isActive: boolean;
}

@Component({
  selector: 'rvw-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'isGuest',
    'isActive',
    'action'
  ];

  data: Data[] = [];
  data$: Observable<Data[]>;

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
  currentSort: Sort;
  currentPage: PageEvent;
  sortedData: Data[] = [];

  constructor(
    private store: Store<AppState>,
    private route: Router,
    private logger: LoggerService,
    private tableService: TableService
  ) {}

  ngOnInit() {
    this.store.dispatch(new ActionMemberLoad());

    this.filter$ = this.filter.valueChanges.pipe(
      startWith(''),
      debounce(() => timer(500)),
      map(s => s.toLocaleLowerCase())
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());
    merge(this.sort.sortChange, this.paginator.page)
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
          return combineLatest([
            this.store.select(selectMemberMembers),
            this.filter$
          ]).pipe(
            map(data =>
              data[0].filter(
                i =>
                  i.email.toLocaleLowerCase().indexOf(data[1]) !== -1 ||
                  i.lastName.toLocaleLowerCase().indexOf(data[1]) !== -1 ||
                  i.firstName.toLocaleLowerCase().indexOf(data[1]) !== -1
              )
            ),
            map(data =>
              data.map(
                item =>
                  ({
                    ...item,
                    isGuest: item.membership.length === 0,
                    isActive: item.membership.some(
                      ms => !ms.to && moment(ms.from).isBefore(moment())
                    )
                  } as Data)
              )
            )
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          this.sortedData = this.tableService.applySort(
            data,
            this.currentSort || {
              active: 'firstName',
              direction: 'asc'
            }
          );

          return this.tableService.applyPaging(
            this.sortedData,
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

  editRoute(id: string) {
    this.route.navigate([`${id}/edit`]);
  }

  private parseFile(
    inputNode: HTMLInputElement,
    handleContent: (csv: ParseResult) => void
  ) {
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csv = papa.parse(e.target.result, { header: true });

        if (csv.errors && csv.errors.length > 0) {
          this.logger.error(JSON.stringify(csv.errors, null, 2));
        } else {
          handleContent(csv);
        }
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  onUpdateFileSelected() {
    const inputNode = document.querySelector<HTMLInputElement>('#updateFile');

    this.parseFile(inputNode, csv =>
      this.store.dispatch(new ActionMemberSave(this.map(csv, true)))
    );
  }

  onCreateFileSelected() {
    const inputNode = document.querySelector<HTMLInputElement>('#createFile');

    this.parseFile(inputNode, csv =>
      this.store.dispatch(new ActionMemberSave(this.map(csv, false)))
    );
  }

  private map(csv: ParseResult, includeId: boolean) {
    const headers = this.parseHeader(csv);

    return csv.data.map(
      d =>
        ({
          id: includeId ? d[headers.idField] : undefined,
          firstName: d[headers.firstNameField],
          lastName: d[headers.lastNameField],
          email: d[headers.emailField] ? d[headers.emailField] : undefined,
          address: d[headers.addressField]
            ? d[headers.addressField]
            : undefined,
          zipCode: d[headers.zipCodeField]
            ? d[headers.zipCodeField]
            : undefined,
          city: d[headers.cityField] ? d[headers.cityField] : undefined,
          membership: d[headers.enlistmentField]
            ? [
                {
                  from: moment(d[headers.enlistmentField]).format('YYYY-MM-DD'),
                  to: d[headers.withdrawalField]
                    ? moment(d[headers.withdrawalField]).format('YYYY-MM-DD')
                    : undefined
                }
              ]
            : [],
          gender: d[headers.genderField] ? d[headers.genderField] : undefined
        } as Member)
    );
  }

  private parseHeader(csv: ParseResult) {
    return {
      idField: csv.meta.fields.find(s => s.startsWith('id')),
      firstNameField: csv.meta.fields.find(s => s.startsWith('firstName')),
      lastNameField: csv.meta.fields.find(s => s.startsWith('lastName')),
      emailField: csv.meta.fields.find(s => s.startsWith('email')),
      addressField: csv.meta.fields.find(s => s.startsWith('address')),
      zipCodeField: csv.meta.fields.find(s => s.startsWith('zipCode')),
      cityField: csv.meta.fields.find(s => s.startsWith('city')),
      enlistmentField: csv.meta.fields.find(s => s.startsWith('enlistment')),
      genderField: csv.meta.fields.find(s => s.startsWith('gender')),
      withdrawalField: csv.meta.fields.find(s => s.startsWith('withdrawal'))
    };
  }
}
