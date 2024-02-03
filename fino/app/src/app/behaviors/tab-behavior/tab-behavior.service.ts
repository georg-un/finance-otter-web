import { Inject, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { addQueryParam } from '../../utils/router-utils';

const TAB_INDEX_QUERY_PARAM = 'tabIndex';

@Injectable()
export class TabBehaviorService {

  /**
   * Current tab index
   */
  tabIndex: number;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor(@Inject('defaultTabIndex') defaultTabIndex: number) {
    this.tabIndex = defaultTabIndex;
    // Sync query param to property
    this.activatedRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(TAB_INDEX_QUERY_PARAM)),
      map((tabIndex) => parseInt(tabIndex!)),  // worst case it's NaN
      filter((tabIndex) => !isNaN(tabIndex)),
    ).subscribe((tabIndex) => {
      this.tabIndex = tabIndex;
    });
  }

  /**
   * Sync tab index to URL query param
   * @param newTabIndex
   */
  tabIndexChange(newTabIndex: number) {
    this.tabIndex = newTabIndex;
    addQueryParam(this.router, this.activatedRoute, { [TAB_INDEX_QUERY_PARAM]: newTabIndex });
  }
}
