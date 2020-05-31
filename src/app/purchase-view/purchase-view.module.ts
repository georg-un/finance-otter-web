import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseViewComponent } from './purchase-view.component';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { DebitCardModule } from '../debit-card/debit-card.module';
import { DynamicDialogComponent } from '../shared/dynamic-dialog/dynamic-dialog.component';

@NgModule({
  declarations: [
    PurchaseViewComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SharedModule,
    DebitCardModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  entryComponents: [
    DynamicDialogComponent
  ]
})
export class PurchaseViewModule { }
