import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { FabComponent } from '../../components/fab/fab.component';
import { PurchaseDetailsComponent } from '../../components/purchase-details/purchase-details.component';
import { TabBehaviorService } from '../../behaviors/tab-behavior/tab-behavior.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ReceiptViewerComponent } from '../../components/receipt-viewer/receipt-viewer.component';
import { filter } from 'rxjs/operators';
import { PurchaseService } from '../../services/purchase.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { WithUid } from '../../utils/with-uid';
import { PurchaseDTO } from '../../../../../domain';

export const PURCHASE_ID_PATH_ID = 'id';
export const SKIP_CACHE_QUERY_PARAM = 'skipCache';

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PurchaseDetailsComponent,
    MatTabsModule,
    FabComponent,
    ReceiptViewerComponent
  ],
  providers: [
    {
      provide: TabBehaviorService,
      useFactory: () => new TabBehaviorService(1),
    },
  ]
})
export class PurchaseViewComponent {
  readonly tabBehavior = inject(TabBehaviorService);

  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly purchaseService = inject(PurchaseService);
  private readonly userService = inject(UserService);
  private readonly categoryService = inject(CategoryService);

  public readonly purchaseId$ = this.activatedRoute.paramMap.pipe(
    map((paramMap) => paramMap.get(PURCHASE_ID_PATH_ID)),
  );

  readonly purchase$: Observable<WithUid<PurchaseDTO>> = this.purchaseId$.pipe(
    filter(Boolean),
    withLatestFrom(this.activatedRoute.paramMap),
    switchMap(([purchaseId, paramMap]) => {
      return this.purchaseService.getPurchase(purchaseId, !!paramMap.get(SKIP_CACHE_QUERY_PARAM));
    }),
    tap((purchase) => {
      if (!purchase) {
        alert('Purchase not found.');
        this.ngZone.run(() => this.router.navigate(['/purchases']));
        return;
      }
    }),
    filter(Boolean),
  );

  readonly users$ = this.userService.users$;

  readonly category$ = this.purchase$.pipe(
    filter(Boolean),
    switchMap((purchase) => this.categoryService.getByUid(purchase.categoryUid)),
  );
}
