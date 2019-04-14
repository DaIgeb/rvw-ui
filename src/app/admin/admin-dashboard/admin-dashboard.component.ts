import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';

import { selectProfile, AppState } from '@app/core';
import { ConfigService } from '@app/core/config.service';
import { Config } from '@app/core/config';

@Component({
  selector: 'rvw-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  configObj: Config;
  userProfile: any;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Users', cols: 1, rows: 1, link: './user' },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1, link: './user' },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public store: Store<AppState>,
    public config: ConfigService
  ) {}

  ngOnInit(): void {
    this.config.getConfig().subscribe(c => (this.configObj = c));
    this.store
      .pipe(select(selectProfile))
      .subscribe(p => (this.userProfile = p));
  }
}
