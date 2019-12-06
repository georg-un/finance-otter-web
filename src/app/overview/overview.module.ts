import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { UserCardComponent } from './user-card/user-card.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    OverviewComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class OverviewModule { }
