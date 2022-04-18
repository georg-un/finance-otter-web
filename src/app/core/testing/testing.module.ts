import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthModule, AuthService } from '@auth0/auth0-angular';
import { AuthServiceMock } from '../../mock/auth-service.mock';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    AuthModule.forRoot({domain: 'foo', clientId: 'bar'})
  ],
  exports: [
    RouterTestingModule,
  ],
  providers: [
    { provide: AuthService, useClass: AuthServiceMock }
  ]
})
export class TestingModule {
}
