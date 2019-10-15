import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';
import {MatCardModule} from '@angular/material';
import {USERS} from '../../rest-service/mock-data/users';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  const mockedUser = USERS[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
      ],
      declarations: [ UserCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = mockedUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should shorten a name', () => {
    const firstName = 'Alice';
    const lastName = 'Cooper';
    const result = component.shortenName(firstName, lastName);
    expect(result).toBe('Alice C.');
  });
});
