import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'rvw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rvw';

  constructor(@Inject(LOCALE_ID) protected localeId: string, public auth: AuthService) {
    console.log(localeId);
  }

  ngOnInit() {
    // If there is an active session on the
    // authorization server, get tokens
    this.auth.renewAuth();
  }
}
