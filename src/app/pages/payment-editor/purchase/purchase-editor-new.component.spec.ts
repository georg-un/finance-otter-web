import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEditorNewComponent } from './purchase-editor-new.component';
import { TestingModule } from '../../../core/testing/testing.module';
import { MaterialTestingModule } from '../../../core/testing/material-testing.module';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { UserSelectors } from '../../../store/selectors/user.selectors';
import { User } from '../../../core/entity/user';
import { USER_LIST_MOCK, USER_MOCK_1 } from '../../../mock/user.mock';
import { CategorySelectors } from '../../../store/selectors/category.selectors';
import { CATEGORY_LIST_MOCK } from '../../../mock/category.mock';
import { ReceiptProcessorService } from '../../receipt-processor/receipt-processor.service';
import { FullscreenDialogService } from '../../../shared/fullscreen-dialog/fullscreen-dialog.service';
import { ReceiptViewModule } from '../../receipt-view/receipt-view.module';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/states/app.state';
import { IdGeneratorService } from '../../../core/id-generator.service';

const MOCKED_STORE_PROVIDER = provideMockStore({
  selectors: [
    {
      selector: UserSelectors.selectCurrentUser,
      value: USER_MOCK_1
    },
    {
      selector: UserSelectors.selectAllUsers,
      value: USER_LIST_MOCK
    },
    {
      selector: CategorySelectors.selectAllCategories,
      value: CATEGORY_LIST_MOCK
    }
  ]
});


describe('PurchaseEditorNewComponent', () => {
  let component: PurchaseEditorNewComponent;
  let fixture: ComponentFixture<PurchaseEditorNewComponent>;
  let receiptProcessorService: ReceiptProcessorService;
  let fullscreenDialgService: FullscreenDialogService;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        MaterialTestingModule,
        FormsModule,
        ReceiptViewModule
      ],
      declarations: [
        PurchaseEditorNewComponent
      ],
      providers: [
        MOCKED_STORE_PROVIDER
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    receiptProcessorService = TestBed.inject(ReceiptProcessorService);
    fullscreenDialgService = TestBed.inject(FullscreenDialogService);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PurchaseEditorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a custom distribution by default', () => {
    expect(component.customDistribution).toEqual(false);
  });

  it('should create the distribution fragments from the users', () => {
    expect(component.distributionFragments.length).toEqual(USER_LIST_MOCK.length);
    const distributionFragmentUsers = component.distributionFragments.map(fragment => fragment.user);
    USER_LIST_MOCK.forEach((user: User) => {
      expect(distributionFragmentUsers.includes(user)).toEqual(true);
    });
  });

  it('should open the receipt-view dialog iff a receipt exists', () => {
    const openDialogSpy = spyOn(fullscreenDialgService, 'openReceiptViewDialog').and.callThrough();
    receiptProcessorService.receipt = null;
    component.onViewReceiptClick();
    expect(openDialogSpy).toHaveBeenCalledTimes(0);
    receiptProcessorService.receipt = new Blob();
    component.onViewReceiptClick();
    expect(openDialogSpy).toHaveBeenCalledTimes(1);
  });

  it('should distribute to all fields iff custom distribution is disabled', () => {
    const distributeToAllSpy = spyOn(component, 'distributeToAllFields').and.stub();
    component.customDistribution = true;
    component.submitPurchase();
    expect(distributeToAllSpy).toHaveBeenCalledTimes(0);
    component.customDistribution = false;
    component.submitPurchase();
    expect(distributeToAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should not submit the purchase if there is no purchase-id', () => {
    spyOn(TestBed.inject(IdGeneratorService), 'generatePurchaseId').and.returnValue(null);
    const dispatchSpy = spyOn(store, 'dispatch').and.stub();
    component.submitPurchase();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should not submit the purchase if it is not valid', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.stub();
    component.submitPurchase();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  });

  it('should submit the purchase if it is valid', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.stub();
    component.purchase.date = new Date().getTime();
    component.sumAmount = 90;
    component.submitPurchase();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
