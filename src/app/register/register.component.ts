import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../store/states/app.state";
import { User } from "../core/entity/user";
import { UserActions } from "../store/actions/user.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  firstName: string;
  lastName: string;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  createUser() {
    let user = new User();
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    this.store.dispatch(UserActions.createNewUser({user: user}));
  }

}
