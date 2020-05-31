import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { mergeMap, take } from 'rxjs/operators';
import { RouterSelectors } from '../store/selectors/router.selectors';
import { FinOBackendService } from '../core/fino-backend.service';
import { PurchaseActions } from '../store/actions/purchase.actions';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DynamicDialogComponent } from '../shared/dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogButton, DynamicDialogData } from '../shared/dynamic-dialog/dynamic-dialog-data.model';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {

  private purchaseId: string;
  encodedImage: any;
  receiptUnavailable = false;

  private readonly deleteReceiptDialogData = <DynamicDialogData>{
    bodyHTML: `
    Delete this receipt?
    <br/><br/>
    <b>Warning:</b> This action cannot be undone.
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
        label: 'Yes, delete!',
        result: true
      }
    ]
  };

  private readonly updateReceiptDialogData = <DynamicDialogData>{
    bodyHTML: `
    Upload another receipt?
    <br/><br/>
    <b>Warning:</b> This will delete the previous receipt for this purchase.
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
        label: 'Yes, upload!',
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
  }

  ngOnInit() {
    // Load receipt via service & convert it to a base64 string to feed it into the <img> element
    this.store.select(RouterSelectors.selectPurchaseId).pipe(
      mergeMap((purchaseId: string) => {
        this.purchaseId = purchaseId;
        return this.restService.fetchReceipt(purchaseId);
      }),
      take(1)
    ).subscribe((img: Blob) => {
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

  onCloseButtonClick() {
    this.location.back();
  }

  onDeleteButtonClick() {
    // Request user confirmation
    const dialogref = this.dialog.open(DynamicDialogComponent, {
      data: this.deleteReceiptDialogData
    });
    dialogref.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.deleteReceipt();
      }
    });
  }

  onUploadNewButtonClick() {
    if (this.receiptUnavailable) {
      this.uploadNewReceipt();
    } else {
      // Request user confirmation
      const dialogref = this.dialog.open(DynamicDialogComponent, {
        data: this.updateReceiptDialogData
      });
      dialogref.afterClosed().subscribe((result: boolean) => {
        if (result === true) {
          this.uploadNewReceipt();
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
      this.router.navigate(['purchase', this.purchaseId]);
    } else {
      console.error('No purchase ID.');
      this.snackBar.open('Ooops, something went wrong');
    }
  }

}
