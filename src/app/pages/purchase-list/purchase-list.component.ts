import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Purchase} from '../../core/entity/purchase';
import {HeaderButtonOptions, HeaderConfig} from '../../shared/domain/header-config';
import {LayoutService} from '../../layout/layout.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPurchaseDialogComponent} from '../../shared/add-purchase-dialog/add-purchase-dialog.component';
import {Destroyable} from '../../shared/destroyable';
import {Select, Store} from '@ngxs/store';
import {PurchaseActions, PurchaseState} from '@fino/store';

const HEADER_CONFIG: HeaderConfig = {leftButton: HeaderButtonOptions.Menu, rightButton: HeaderButtonOptions.Add, showLogo: true};

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseListComponent extends Destroyable {

  @Select(PurchaseState.selectAllPurchases())
  public purchases$: Observable<Purchase[]>;

  @Select(PurchaseState.selectIsLoading())
  public isLoading$: Observable<boolean>;

  constructor(
    private store: Store,
    private layoutService: LayoutService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
    this.layoutService.setHeaderConfig(HEADER_CONFIG);
    this.layoutService.registerLeftHeaderButtonClickCallback(() => this.layoutService.toggleSidenav());
    this.layoutService.registerRightHeaderButtonClickCallback(() => this.showAddPurchaseDialog());
  }

  public onCardClick($event: string): void {
    this.router.navigateByUrl('/purchase/' + $event);
  }

  public onScrolledDown(): void {
    const purchaseCount = this.store.selectSnapshot(PurchaseState.selectAllPurchases()).length;
    this.store.dispatch(new PurchaseActions.FetchPurchases({offset: purchaseCount, limit: 10}));
  }

  private showAddPurchaseDialog(): void {
    this.dialog.open(AddPurchaseDialogComponent);
  }
}
