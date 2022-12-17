import { Observable } from 'rxjs';
import { Purchase } from '../../core/entity/purchase';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../core/entity/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/states/app.state';
import { DistributionFragment } from './distribution-fragment';
import { MultilineSnackbarComponent } from '../../shared/multiline-snackbar/multiline-snackbar.component';
import { BigNumber } from 'bignumber.js';
import { Category } from '../../core/entity/category';
import { FullscreenDialogService } from '../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HeaderButtonOptions, HeaderConfig } from '../../shared/domain/header-config';
import { DynamicDialogButton, DynamicDialogData } from '../../shared/dynamic-dialog/dynamic-dialog-data.model';
import { LayoutService } from '../../layout/layout.service';
import { DynamicDialogComponent } from '../../shared/dynamic-dialog/dynamic-dialog.component';
import { Location } from '@angular/common';
import { Moment } from 'moment';
import { Destroyable } from '../../shared/destroyable';
import { Select } from '@ngxs/store';
import { UserState } from '../../store/user/user.state';
import { CategoryState } from '../../store/category/category.state';

const HEADER_CONFIG: HeaderConfig = {leftButton: HeaderButtonOptions.Cancel, rightButton: HeaderButtonOptions.Done, showLogo: false};
const EXIT_EDITOR_DIALOG_DATA: DynamicDialogData = {
  bodyHTML: `
    <h3>Discard changes?</h3>
    Are you sure you want to exit the editor?
    <br/><br/>
    All unsaved progress will be lost.
    <br/><br/>
    `,
  buttons: [
    {
      index: 0,
      label: 'Cancel',
      result: false
    } as DynamicDialogButton,
    {
      index: 1,
      label: 'Leave',
      color: 'accent',
      result: true
    } as DynamicDialogButton
  ]
};


export abstract class AbstractPaymentEditor extends Destroyable {

  purchase: Purchase;
  receipt$: Observable<Blob>;
  sumAmount: number;
  @Select(UserState.selectAllUsers()) users$: Observable<User[]>;
  @Select(CategoryState.selectAllCategories()) categories$: Observable<Category[]>;
  date: Date;
  distributionFragments: DistributionFragment[] = [];

  readonly autofilledState = {
    amount: false,
    date: false
  };

  protected constructor(protected store: Store<AppState>,
                        protected fullscreenDialog: FullscreenDialogService,
                        protected snackBar: MatSnackBar,
                        protected dialog: MatDialog,
                        protected layoutService: LayoutService,
                        protected location: Location
  ) {
    super();
    this.layoutService.setHeaderConfig(HEADER_CONFIG);
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.closeEditorAfterConfirmation());
    this.layoutService.registerRightHeaderButtonClickCallback(() => this.submitPurchase());
  }

  abstract submitPurchase(): void;

  abstract onViewReceiptClick(): void;

  onSetDateNowClick(): void {
    const date = new Date();
    this.date = date;
    this.purchase.date = date.getTime();
  }

  onDateInput($event: Moment) {
    this.purchase.date = $event?.valueOf();
    this.autofilledState.date = false;
  }

  onScanQrCodeClick(): void {
    this.fullscreenDialog.openQrScannerDialog()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result: { date: Date, amount: BigNumber }) => {
        if (result) {
          setTimeout(() => {
            this.sumAmount = result.amount.toNumber();
            this.date = result.date;
            this.purchase.date = result.date.getTime();
            this.autofilledState.amount = true;
            this.autofilledState.date = true;
          }, 200);
        }
      });
  }

  isPurchaseValid(checkDistributionFragments: boolean): boolean {
    if (!this.purchase.buyerId) {
      this.snackBar.openFromComponent(MultilineSnackbarComponent, {data: 'User ID is missing.'});
      return false;
    } else if (!this.purchase.date) {
      this.snackBar.open('Please enter a date.');
      return false;
    } else if (!this.sumAmount) {
      this.snackBar.open('Please enter the amount.');
      return false;
    } else if (checkDistributionFragments && !new BigNumber(this.sumAmount).isEqualTo(
      this.distributionFragments
        .filter(fragment => fragment.checked)
        .map(fragment => new BigNumber(fragment.amount))
        .reduce((sum, curr) => sum.plus(curr), new BigNumber(0)))
    ) {
      this.snackBar.open('Total amount and debits don\'t match.');
      return false;
    } else {
      return true;
    }
  }

  resetDistributionFragments(): void {
    this.distributionFragments.forEach(fragment => {
      fragment.amount = null;
    });
  }

  distributeToAllFields(): void {
    this.distributeToFields(
      this.distributionFragments.filter(fragment => fragment.checked)
    );
  }

  distributeToEmptyFields(): void {
    this.distributeToFields(
      this.distributionFragments.filter(fragment => fragment.checked && !fragment.amount)
    );
  }

  private distributeToFields(relevantFields: DistributionFragment[]): void {
    const sum = new BigNumber(this.sumAmount);
    // Get the remaining value
    const rest = this.getRest(
      sum,
      this.distributionFragments
        .filter(fragment => fragment.checked)
        .map(fragment => new BigNumber(fragment.amount || 0))
    );
    if ((sum.isPositive() && rest.isLessThan(0)) || (sum.isNegative() && rest.isGreaterThan(0))) {
      console.error(`A remainder (${rest.toNumber()}) was left over on when distributing the total amount (${this.sumAmount}).`);
      this.snackBar.open('Could not distribute the amount.');
      return;
    }
    // Distribute the rest by the Bresenham Algorithm
    const assignedValues: BigNumber[] = this.distributeByBresenham(
      rest,
      new BigNumber(relevantFields.length)
    );
    // Assign the calculated values to the distribution-fragments
    relevantFields.forEach(field => {
      field.amount = assignedValues.pop().plus(field.amount || 0).toNumber();
    });
  }

  private getRest(totalAmount: BigNumber, amounts: BigNumber[]): BigNumber {
    return totalAmount.minus(
      amounts.reduce((a, b) => a.plus(b), new BigNumber(0))
    );
  }

  private distributeByBresenham(rest: BigNumber, nFields: BigNumber): BigNumber[] {
    const result: BigNumber[] = [];
    // Distribute the rest evenly
    const assignedValue = rest.dividedBy(nFields).decimalPlaces(2, BigNumber.ROUND_DOWN);
    for (let i = 0; i < nFields.toNumber(); i++) {
      result.push(assignedValue);
    }
    // Calculate the remained that could not be evenly distributed
    let remainder = rest.minus(assignedValue.times(nFields.toNumber()));
    // Distribute the rest to all fields cent by cent
    let resultIdx = Math.floor(Math.random() * result.length);  // randomly pick a starting position
    while (remainder.isGreaterThan(0)) {
      if (resultIdx >= result.length) {
        resultIdx = 0;  // reset index
      }
      result[resultIdx] = result[resultIdx].plus(0.01);
      remainder = remainder.minus(0.01);
      resultIdx += 1;
    }
    return result;
  }

  private closeEditorAfterConfirmation(): void {
    const dialogref = this.dialog.open(DynamicDialogComponent, {
      data: EXIT_EDITOR_DIALOG_DATA
    });
    dialogref.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.location.back();
      }
    });
  }
}
