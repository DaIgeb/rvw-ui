import { Component, OnInit } from '@angular/core';
import { AppState, ActionAuthCheckLogin, LocalStorageService } from '@app/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rvw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rvw';

  constructor(private store: Store<AppState>, private storageService: LocalStorageService) {
  }

  ngOnInit() {
    this.storageService.testLocalStorage();
    this.store.dispatch(new ActionAuthCheckLogin());
  }
}
