import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import {
  selectIsAuthenticated,
  AppState,
  ActionAuthLogin,
  ActionAuthLogout,
  selectIsSideNavShown,
  ToggleSideNav
} from '@app/core';

@Component({
  selector: 'rvw-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  showSideNav$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.showSideNav$ = this.store.pipe(select(selectIsSideNavShown));
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }

  toggleSideNav(toggle: boolean) {
    this.store.dispatch(new ToggleSideNav(toggle));
  }

  login() {
    this.store.dispatch(new ActionAuthLogin());
  }

  logout() {
    this.store.dispatch(new ActionAuthLogout());
  }
}
