import { Component, OnInit } from '@angular/core';
import { AbstractPaymentEditor } from '../abstract-payment-editor';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/states/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { IdGeneratorService } from '../../../core/id-generator.service';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { Debit } from '../../../core/entity/debit';
import { PurchaseActions } from '../../../store/actions/purchase.actions';
import { Purchase } from '../../../core/entity/purchase';
import { UserSelectors } from '../../../store/selectors/user.selectors';
import { User } from '../../../core/entity/user';
import { combineLatest, Observable } from 'rxjs';
import { LayoutService } from '../../../layout/layout.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-compensation-editor-new',
  templateUrl: './compensation-editor.component.html',
  styleUrls: [
    '../payment-editor.component.scss',
    './compensation-editor.component.scss'
  ]
})
export class CompensationEditorNewComponent extends AbstractPaymentEditor implements OnInit {

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
    this.purchase = {} as Purchase;

    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser);
    this.currentUser$.pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$)
    ).subscribe((currentUser: User) => {
      this.purchase.buyerId = currentUser.userId;
    });
    this.recipients$ = combineLatest([this.users$, this.currentUser$]).pipe(
      map(([users, currentUser]) => users.filter(u => u.userId !== currentUser.userId))
    );
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
    this.idGeneratorService.generatePurchaseId()
      .pipe(take(1))
      .subscribe((purchaseId: string) => {
        if (purchaseId) {
          this.purchase.purchaseId = purchaseId;
          this.purchase.isCompensation = true;
          this.purchase.debits = [
            {
              debitId: this.idGeneratorService.generateDebitId(purchaseId, 0),
              debtorId: this.recipientId,
              amount: this.sumAmount
            } as Debit
          ];
          this.store.dispatch(
            PurchaseActions.addNewPurchase({
              purchase: this.purchase,
              receipt: null
            })
          );
        } else {
          this.snackBar.open('Ooops, something went wrong.');
        }
      });
  }
}
