import { Component, OnInit } from '@angular/core';
import { AbstractPaymentEditor } from '../abstract-payment-editor';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/states/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { IdGeneratorService } from '../../../core/id-generator.service';
import { map, takeUntil } from 'rxjs/operators';
import { UserSelectors } from '../../../store/selectors/user.selectors';
import { User } from '../../../core/entity/user';
import { combineLatest, Observable } from 'rxjs';
import { PurchaseSelectors } from '../../../store/selectors/purchase.selectors';
import { cloneDeep } from 'lodash-es';
import { LayoutService } from '../../../layout/layout.service';
import { Location } from '@angular/common';
import { PurchaseActions } from '../../../store/actions/purchase.actions';
import { Debit } from '../../../core/entity/debit';

@Component({
  selector: 'app-compensation-editor-new',
  templateUrl: './compensation-editor.component.html',
  styleUrls: [
    '../payment-editor.component.scss',
    './compensation-editor.component.scss'
  ]
})
export class CompensationEditorEditComponent extends AbstractPaymentEditor implements OnInit {

  public recipients$: Observable<User[]>;
  public recipientId: string;
  private currentUser$: Observable<User>;

  constructor(protected store: Store<AppState>,
              protected snackBar: MatSnackBar,
              protected dialog: MatDialog,
              protected idGeneratorService: IdGeneratorService,
              protected fullscreenDialog: FullscreenDialogService,
              protected layoutService: LayoutService,
              protected location: Location,
  ) {
    super(store, fullscreenDialog, snackBar, dialog, layoutService, location);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser);
    this.recipients$ = combineLatest([this.users$, this.currentUser$]).pipe(
      map(([users, currentUser]) => users.filter(u => u.userId !== currentUser.userId))
    );
    this.store.select(PurchaseSelectors.selectCurrentPurchase)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(p => {
        this.purchase = cloneDeep(p);
        this.date = new Date(this.purchase.date);
        this.recipientId = this.purchase.debits[0].debtorId;
        this.sumAmount = this.purchase.debits[0].amount;
      });
  }

  onViewReceiptClick(): void {}

  submitPurchase(): void {
    if (!this.isPurchaseValid(false)) {
      return;
    }
    if (!this.recipientId) {
      this.snackBar.open('Please select a recipient.');
      return;
    }
    this.purchase.debits = [
      {
        debitId: this.idGeneratorService.generateDebitId(this.purchase.purchaseId, 0),
        debtorId: this.recipientId,
        amount: this.sumAmount
      } as Debit
    ];
    this.store.dispatch(
      PurchaseActions.updatePurchase({
        purchase: this.purchase
      })
    );
  }
}
