import { TestBed } from '@angular/core/testing';

import { FinOBackendService } from './fino-backend.service';
import { TestingModule } from './testing/testing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialTestingModule } from './testing/material-testing.module';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User } from './entity/user';
import { Purchase } from './entity/purchase';
import { Category } from './entity/category';
import { ChartSeries } from './entity/chart-series';
import { ChartData } from './entity/chart-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import Spy = jasmine.Spy;

type Parameters<T> = T extends (... args: infer T) => any ? T : never;
type ReturnType<T> = T extends (... args: any[]) => infer T ? T : never;

interface TestMethods {
  [method: string]: {
    args: any[],
    mockResult: any,
    httpMethod: 'get' | 'post' | 'put' | 'delete'
  }
}

describe('FinOBackendService', () => {

  let service: FinOBackendService;
  let http: HttpClient;

  const mockUser1 = {userId: 'u1'} as User;
  const mockUser2 = {userId: 'u2'} as User;
  const mockPurchase1 = {purchaseId: 'p1'} as Purchase;
  const mockPurchase2 = {purchaseId: 'p2'} as Purchase;

  const methodsToTest: TestMethods = {
    checkIfUserActive: {
      args: <Parameters<typeof FinOBackendService.prototype.checkIfUserActive>>[],
      mockResult: true,
      httpMethod: 'get'
    },
    createNewUser: {
      args: <Parameters<typeof FinOBackendService.prototype.createNewUser>>[mockUser1],
      mockResult: mockUser1,
      httpMethod: 'post'
    },
    fetchPurchases: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchPurchases>>[0, 100],
      mockResult: [mockPurchase1, mockPurchase2],
      httpMethod: 'get'
    },
    fetchPurchase: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchPurchase>>[mockPurchase1.purchaseId],
      mockResult: mockPurchase1,
      httpMethod: 'get'
    },
    fetchUsers: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchUsers>>[],
      mockResult: [mockUser1, mockUser2],
      httpMethod: 'get'
    },
    fetchCategories: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchCategories>>[],
      mockResult: [{id: 1} as Category, {id: 2} as Category],
      httpMethod: 'get'
    },
    fetchReceipt: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchReceipt>>[mockPurchase1.purchaseId],
      mockResult: null,
      httpMethod: 'get'
    },
    uploadNewPurchase: {
      args: <Parameters<typeof FinOBackendService.prototype.uploadNewPurchase>>[mockPurchase1, null],
      mockResult: mockPurchase1,
      httpMethod: 'post'
    },
    updatePurchase: {
      args: <Parameters<typeof FinOBackendService.prototype.updatePurchase>>[mockPurchase1],
      mockResult: mockPurchase1,
      httpMethod: 'put'
    },
    deletePurchase: {
      args: <Parameters<typeof FinOBackendService.prototype.deletePurchase>>[mockPurchase1.purchaseId],
      mockResult: null,
      httpMethod: 'delete'
    },
    updateReceipt: {
      args: <Parameters<typeof FinOBackendService.prototype.updateReceipt>>[mockPurchase1.purchaseId, null],
      mockResult: null,
      httpMethod: 'put'
    },
    deleteReceipt: {
      args: <Parameters<typeof FinOBackendService.prototype.deleteReceipt>>[mockPurchase1.purchaseId],
      mockResult: null,
      httpMethod: 'delete'
    },
    fetchBalances: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchBalances>>[],
      mockResult: null,
      httpMethod: 'get'
    },
    fetchCategoryMonthSummary: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchCategoryMonthSummary>>[3],
      mockResult: [{name: 's1'} as ChartSeries],
      httpMethod: 'get'
    },
    fetchCategorySummary: {
      args: <Parameters<typeof FinOBackendService.prototype.fetchCategorySummary>>[3],
      mockResult: [{name: 'd1'} as ChartData],
      httpMethod: 'get'
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule,
      MaterialTestingModule,
      HttpClientTestingModule
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(FinOBackendService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    const service: FinOBackendService = TestBed.get(FinOBackendService);
    expect(service).toBeTruthy();
  });

  it('should check if user is active', () => {
    testHttpCall('checkIfUserActive');
  });

  it('should create a new user', () => {
    testHttpCall('createNewUser');
  });

  it('should fetch purchases', () => {
    const callback = testHttpCall('fetchPurchases');
    callback.call.subscribe(() => {
      expect(callback.httpSpy.calls.mostRecent().args.length).toEqual(2);
      expect(callback.httpSpy.calls.mostRecent().args[1]['params'].get('offset')).toEqual('0');
      expect(callback.httpSpy.calls.mostRecent().args[1]['params'].get('limit')).toEqual('100');
    });
  });

  it('should fetch a purchase', () => {
    testHttpCall('fetchPurchase');
  });

  it('should fetch users', () => {
    testHttpCall('fetchUsers');
  });

  it('should fetch categories', () => {
    testHttpCall('fetchCategories');
  });

  it('should fetch a receipt', () => {
    testHttpCall('fetchReceipt');
  });

  it('should upload a new purchase', () => {
    const callback = testHttpCall('uploadNewPurchase');
    callback.call.subscribe(() => {
      expect(callback.httpSpy.calls.mostRecent().args.length).toEqual(2);
      expect(callback.httpSpy.calls.mostRecent().args[1].get('purchase')).toBeTruthy();
      expect(callback.httpSpy.calls.mostRecent().args[1].get('receipt')).toBeTruthy();
    });
  });

  it('should update a purchase', () => {
    testHttpCall('updatePurchase');
  });

  it('should delete a purchase', () => {
    testHttpCall('deletePurchase');
  });

  it('should update a receipt', () => {
    testHttpCall('updateReceipt');
  });

  it('should delete a receipt', () => {
    testHttpCall('deleteReceipt');
  });

  it('should fetch balances', () => {
    testHttpCall('fetchBalances');
  });

  it('should fetch the category-by-months summary', () => {
    const callback = testHttpCall('fetchCategoryMonthSummary');
    callback.call.subscribe(() => {
      expect(callback.httpSpy.calls.mostRecent().args.length).toEqual(2);
      expect(callback.httpSpy.calls.mostRecent().args[1]['params'].get('months')).toEqual('3');
    });
  });

  it('should fetch the category summary', () => {
    const callback = testHttpCall('fetchCategorySummary');
    callback.call.subscribe(() => {
      expect(callback.httpSpy.calls.mostRecent().args.length).toEqual(2);
      expect(callback.httpSpy.calls.mostRecent().args[1]['params'].get('months')).toEqual('3');
    });
  });

  it('should handle errors', () => {
    ['get', 'post', 'put', 'delete'].forEach((httpMethod: 'get' | 'post' | 'put' | 'delete') => {
      spyOn(http, httpMethod).and.returnValue(throwError({error: 'mocked error'}));
    });
    spyOn(console, 'error').and.stub();
    const snackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent').and.stub();

    Object.keys(methodsToTest).forEach(methodName => {
      testErrorHandling(
        methodName,
        methodsToTest[methodName].args,
        snackBarSpy,
        'mocked error'
      );
    });
  });

  const testHttpCall = (methodName: string): {call: Observable<any>, httpSpy: Spy} => {
    const method = methodsToTest[methodName];
    const httpSpy = spyOn(http, method.httpMethod).and.returnValue(of(method.mockResult));
    const methodCall = service[methodName](...method.args);
    methodCall.subscribe(r => {
      expect(r).toEqual(method.mockResult)
    });
    return {call: methodCall, httpSpy: httpSpy};
  };

  const testErrorHandling = (methodName: string, args: any[], snackBarSpy: Spy, errorMsg: string) => {
    service[methodName](...args).subscribe(
      () => {},
      (err) => {
        expect(snackBarSpy).toHaveBeenCalled();
        expect(err).toEqual(errorMsg)
      });
  };
});
