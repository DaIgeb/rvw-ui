import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { AppState, ActionAuthCheckLogin } from '@app/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rvw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rvw';

  constructor(@Inject(LOCALE_ID) protected localeId: string, private store: Store<AppState>) {
    console.log(localeId);
  }

  ngOnInit() {
    // If there is an active session on the
    // authorization server, get tokens
    // this.auth.renewAuth();
    this.store.dispatch(new ActionAuthCheckLogin());
  }
}
