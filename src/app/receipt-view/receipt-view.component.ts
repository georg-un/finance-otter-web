import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/states/app.state';
import { mergeMap, take } from 'rxjs/operators';
import { RouterSelectors } from '../store/selectors/router.selectors';
import { FinOBackendService } from '../core/fino-backend.service';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {

  encodedImage: any;

  constructor(
    private store: Store<AppState>,
    private restService: FinOBackendService
  ) {
  }

  ngOnInit() {
    // Load receipt via service & convert it to a base64 string to feed it into the <img> element
    this.store.select(RouterSelectors.selectPurchaseId).pipe(
      mergeMap((purchaseId: string) => this.restService.fetchReceipt(purchaseId)),
      take(1)
    ).subscribe((img: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.encodedImage = reader.result;
      };
      reader.readAsDataURL(img);
    });
  }

}
