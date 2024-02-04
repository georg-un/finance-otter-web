import { Directive, inject, Provider } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DEBIT_FORM_PROPS } from './form/debit-form-group';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { PurchaseService } from '../../services/purchase.service';
import { Destroyable } from '../../components/destroyable';
import { DebitSumPipe } from '../../utils/debit-sum.pipe';
import { DISTRIBUTION_MODES, PURCHASE_FORM_PROPS } from './form/purchase-form-group';
import { PurchaseFormBehaviorService } from './form/purchase-form-behavior.service';

export const PURCHASE_EDITOR_IMPORTS = [
  CommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  ReactiveFormsModule
];

export const PURCHASE_EDITOR_PROVIDERS: Provider[] = [
  DebitSumPipe,
  PurchaseFormBehaviorService,
  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
];

@Directive({
  selector: 'DO-NOT-USE-abstract-purchase-editor',
  standalone: true,
  providers: [
    ...PURCHASE_EDITOR_PROVIDERS
  ]
})
export abstract class AbstractPurchaseEditorComponent extends Destroyable {
  readonly DISTRIBUTION_MODES = DISTRIBUTION_MODES;
  readonly FORM_PROPS = PURCHASE_FORM_PROPS;
  readonly DEBIT_FORM_PROPS = DEBIT_FORM_PROPS;

  readonly purchaseFormBehavior = inject(PurchaseFormBehaviorService);
  protected readonly purchaseService = inject(PurchaseService);

  readonly form = this.purchaseFormBehavior.form;
  readonly debits = this.purchaseFormBehavior.debits;
  readonly users$ = this.purchaseFormBehavior.users$;
  readonly categories$ = this.purchaseFormBehavior.categories$;

  abstract submitPurchase(): void;
}
