import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { UserCardComponent } from './user-card/user-card.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    SummaryComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class SummaryModule { }
