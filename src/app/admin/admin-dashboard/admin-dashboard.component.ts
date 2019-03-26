import { Component, OnInit } from '@angular/core';
import { map, first, tap, take } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/core/config.service';
import { Config } from 'src/app/core/config';

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

  ngOnInit(): void {
    this.config.getConfig().subscribe(c => (this.configObj = c));
    this.auth.getUserProfile().subscribe(p => (this.userProfile = p));
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    public config: ConfigService
  ) {}
}
