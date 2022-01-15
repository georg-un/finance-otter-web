import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';
import { QrScannerModule } from '../qr-scanner/qr-scanner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PurchaseEditorNewComponent } from './purchase/purchase-editor-new.component';
import { PurchaseEditorEditComponent } from './purchase/purchase-editor-edit.component';
import { CompensationEditorNewComponent } from './compensation/compensation-editor-new.component';
import { CompensationEditorEditComponent } from './compensation/compensation-editor-edit.component';


@NgModule({
  declarations: [
    PurchaseEditorNewComponent,
    PurchaseEditorEditComponent,
    CompensationEditorNewComponent,
    CompensationEditorEditComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    QrScannerModule
  ],
  entryComponents: [
    QrScannerComponent
  ]
})
export class PurchaseEditorModule { }
