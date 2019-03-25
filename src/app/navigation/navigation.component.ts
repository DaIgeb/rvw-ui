import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'rvw-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  isLoggedIn = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.token$.subscribe(t => (this.isLoggedIn = !!t));
  }

  login = () => {
    this.auth.login();
  }

  logout = () => {
    this.auth.logout();
  }
}
