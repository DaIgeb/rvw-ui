import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as papa from 'papaparse';
import { ActionMemberSave, ActionMemberLoad } from '@app/core/member/member.actions';
import { Member } from '@app/core/member/member.model';
import { Observable, of, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { Router } from '@angular/router';
import { selectMemberMembers } from '@app/core/member/member.selectors';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'rvw-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'action'];

  data: Member[] = [];
  data$: Observable<Member[]>;

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
    this.store.dispatch(new ActionMemberLoad());
//    this.store.select(selectMemberMembers).subscribe(data => (this.data = data));
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
          const dataSource = this.store.select(selectMemberMembers);
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

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csv = papa.parse(e.target.result, { header: true });

        if (csv.errors && csv.errors.length > 0) {
          this.logger.error(JSON.stringify(csv.errors, null, 2));
        } else {
          const firstNameField = csv.meta.fields.find(s => s.startsWith('firstName'));
          const lastNameField = csv.meta.fields.find(s =>
            s.startsWith('lastName')
          );

          this.store.dispatch(
            new ActionMemberSave(
              csv.data.map(d => ({
                firstName: d[firstNameField],
                lastName: d[lastNameField]
              }))
            )
          );
        }
      };

      reader.readAsText(inputNode.files[0]);
    }
  }
}
