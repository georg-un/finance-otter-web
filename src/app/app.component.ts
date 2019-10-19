import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { requestUserData } from "./store/actions/core.actions";
import { AppState } from "./store/states/app.state";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(requestUserData());
  }

}
