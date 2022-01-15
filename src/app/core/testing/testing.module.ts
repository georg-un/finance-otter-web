import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from '../../store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { AUTH_SERVICE_MOCK } from '../../mock/auth-service.mock';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    StoreModule.forRoot(
      reducers,
      {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        }
      }),
    EffectsModule.forRoot([])
  ],
  exports: [
    RouterTestingModule,
  ],
  providers: [
    { provide: AuthService, useValue: AUTH_SERVICE_MOCK }
  ]
})
export class TestingModule { }
