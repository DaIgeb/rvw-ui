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
import { map, startWith, switchMap, delay, debounce } from 'rxjs/operators';
import { TableService } from '@app/shared/table.service';
import { ParseResult } from 'papaparse';
import * as moment from 'moment';

@Component({
  selector: 'rvw-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'action'];

  data: Member[] = [];
  data$: Observable<Member[]>;

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
  sortedData: Member[] = [];

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

    this.parseFile(inputNode, csv => {
      const firstNameField = csv.meta.fields.find(s =>
        s.startsWith('firstName')
      );
      const idField = csv.meta.fields.find(s => s.startsWith('id'));
      const lastNameField = csv.meta.fields.find(s => s.startsWith('lastName'));
      const emailField = csv.meta.fields.find(s => s.startsWith('email'));
      const addressField = csv.meta.fields.find(s => s.startsWith('address'));
      const zipCodeField = csv.meta.fields.find(s => s.startsWith('zipCode'));
      const cityField = csv.meta.fields.find(s => s.startsWith('city'));
      const enlistmentField = csv.meta.fields.find(s =>
        s.startsWith('enlistment')
      );
      const genderField = csv.meta.fields.find(s => s.startsWith('gender'));

      this.store.dispatch(
        new ActionMemberSave(
          csv.data.map(d => ({
            id: d[idField],
            firstName: d[firstNameField],
            lastName: d[lastNameField],
            email: d[emailField] ? d[emailField] : undefined,
            address: d[addressField] ? d[addressField] : undefined,
            zipCode: d[zipCodeField] ? d[zipCodeField] : undefined,
            city: d[cityField] ? d[cityField] : undefined,
            enlistment: d[enlistmentField]
              ? moment(d[enlistmentField]).format('YYYY-MM-DD')
              : undefined,
            gender: d[genderField] ? d[genderField] : undefined
          }))
        )
      );
    });
  }

  onCreateFileSelected() {
    const inputNode = document.querySelector<HTMLInputElement>('#createFile');

    this.parseFile(inputNode, csv => {
      const firstNameField = csv.meta.fields.find(s =>
        s.startsWith('firstName')
      );
      const lastNameField = csv.meta.fields.find(s => s.startsWith('lastName'));
      const emailField = csv.meta.fields.find(s => s.startsWith('email'));

      this.store.dispatch(
        new ActionMemberSave(
          csv.data.map(d => ({
            firstName: d[firstNameField],
            lastName: d[lastNameField],
            email: d[emailField]
          }))
        )
      );
    });
  }
}
