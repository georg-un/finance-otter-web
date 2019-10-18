import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MockRestService } from "../../core/rest-service/mock-rest.service";
import { catchError, map, mergeMap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import * as CoreActions from '../actions/core.actions';



@Injectable()
export class CoreEffects {

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(CoreActions.requestUserData),
    mergeMap(() => this.restService.fetchUsers()
      .pipe(
        map(users => (CoreActions.userDataReceived({users}))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(private actions$: Actions,
              private restService: MockRestService) {}

}
