import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { FinOBackendService } from '../core/fino-backend.service';
import { PurchaseActions } from '../store/actions/purchase.actions';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DynamicDialogComponent } from '../shared/dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogButton, DynamicDialogData } from '../shared/dynamic-dialog/dynamic-dialog-data.model';
import { Observable } from 'rxjs';
import { AbstractFullscreenDialog } from '../shared/fullscreen-dialog/abstract-fullscreen-dialog';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent extends AbstractFullscreenDialog implements OnInit {

  encodedImage: any;
  receiptUnavailable = false;

  @Input()
  receipt: Observable<Blob>;

  @Input()
  purchaseId: string;

  @Input()
  enableEditButtons: boolean;

  private readonly deleteReceiptDialogData = <DynamicDialogData>{
    bodyHTML: `
    Are you sure you want to delete this receipt?
    <br/><br/>
    This action cannot be undone.
    <br/><br/>
    `,
    buttons: [
      <DynamicDialogButton>{
        index: 0,
        label: 'Cancel',
        result: false
      },
      <DynamicDialogButton>{
        index: 1,
        label: 'Delete',
        color: 'warn',
        result: true
      }
    ]
  };

  private readonly updateReceiptDialogData = <DynamicDialogData>{
    bodyHTML: `
    <b>Warning:</b> Uploading a new receipt will delete the previous receipt for this purchase.
    <br/><br/>
    Do you want to continue?
    <br/><br/>
    `,
    buttons: [
      <DynamicDialogButton>{
        index: 0,
        label: 'Cancel',
        result: false
      },
      <DynamicDialogButton>{
        index: 1,
        label: 'Upload new',
        color: 'accent',
        result: true
      }
    ]
  };

  constructor(
    private store: Store<AppState>,
    private restService: FinOBackendService,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    // Convert image to a base64 string to feed it into the <img> element
    this.receipt
      .subscribe((img: Blob) => {
        if (img) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.encodedImage = reader.result;
          };
          reader.readAsDataURL(img);
        } else {
          this.receiptUnavailable = true;
        }
      });
  }

  onDeleteButtonClick() {
    // Request user confirmation
    const dialogref = this.dialog.open(DynamicDialogComponent, {
      data: this.deleteReceiptDialogData
    });
    dialogref.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.deleteReceipt();
        this.close.next();
      }
    });
  }

  onUploadNewButtonClick() {
    if (this.receiptUnavailable) {
      this.uploadNewReceipt();
      this.close.next();
    } else {
      // Request user confirmation
      const dialogref = this.dialog.open(DynamicDialogComponent, {
        data: this.updateReceiptDialogData
      });
      dialogref.afterClosed().subscribe((result: boolean) => {
        if (result === true) {
          this.uploadNewReceipt();
          this.close.next();
        }
      });
    }
  }

  private uploadNewReceipt(): void {
    if (this.purchaseId) {
      this.router.navigate(['scan-receipt', this.purchaseId]);
    } else {
      console.error('No purchase ID.');
      this.snackBar.open('Ooops, something went wrong');
    }
  }

  private deleteReceipt(): void {
    if (this.purchaseId) {
      this.store.dispatch(PurchaseActions.deleteReceipt({purchaseId: this.purchaseId}));
    } else {
      console.error('No purchase ID.');
      this.snackBar.open('Ooops, something went wrong');
    }
  }

}
