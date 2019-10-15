import { Component, OnInit, ViewChild } from '@angular/core';
import * as papa from 'papaparse';
import { ActionMemberSave, ActionMemberLoad } from '@app/core/member/member.actions';
import { Member } from '@app/core/member/member.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core';
import { LoggerService } from '@app/core/logger.service';
import { Router } from '@angular/router';
import { selectMemberMembers } from '@app/core/member/member.selectors';

@Component({
  selector: 'rvw-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'elevation', 'distance', 'action'];

  data: Member[] = [];
  data$: Observable<Member[]>;

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
    this.store.dispatch(new ActionMemberLoad());
    this.store.select(selectMemberMembers).subscribe(data => (this.data = data));
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
            new ActionMemberSave(
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
