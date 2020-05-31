import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { mergeMap, take } from 'rxjs/operators';
import { RouterSelectors } from '../store/selectors/router.selectors';
import { FinOBackendService } from '../core/fino-backend.service';
import { PurchaseActions } from '../store/actions/purchase.actions';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { PurchaseSelectors } from '../store/selectors/purchase.selectors';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {

  private purchaseId: string;
  encodedImage: any;
  receiptUnavailable = false;

  constructor(
    private store: Store<AppState>,
    private restService: FinOBackendService,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
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
    if (this.purchaseId) {
      this.store.dispatch(PurchaseActions.deleteReceipt({purchaseId: this.purchaseId}));
      this.router.navigate(['purchase', this.purchaseId]);
    } else {
      console.error('No purchase ID.');
      this.snackBar.open('Ooops, something went wrong');
    }
  }

  onUploadNewButtonClick() {
    if (this.purchaseId) {
      this.router.navigate(['scan-receipt', this.purchaseId]);
    } else {
      console.error('No purchase ID.');
      this.snackBar.open('Ooops, something went wrong');
    }
  }

}
