import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ActionAuthLoginComplete } from '../core';

@Component({
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
      this.store.dispatch(new ActionAuthLoginComplete());
  }
}
