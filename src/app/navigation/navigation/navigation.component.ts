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
  User,
  selectCurrentUser,
  selectCurrentUserName,
  selectCurrentUserIsAdmin
} from '@app/core';
import { selectNavigationShowSidebar } from '../navigation.selectors';
import { ActionNavigationToggleSidebar } from '../navigation.actions';

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
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | undefined>;
  userName$: Observable<string | undefined>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.showSideNav$ = this.store.pipe(select(selectNavigationShowSidebar));
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
    this.userName$ = this.store.pipe(select(selectCurrentUserName));
    this.isAdmin$ = this.store.pipe(select(selectCurrentUserIsAdmin));
  }

  toggleSideNav() {
    this.store.dispatch(new ActionNavigationToggleSidebar());
  }

  login() {
    this.store.dispatch(new ActionAuthLogin());
  }

  logout() {
    this.store.dispatch(new ActionAuthLogout());
  }
}
