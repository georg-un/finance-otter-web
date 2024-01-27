import { ActivatedRoute, Params, Router } from '@angular/router';

export function addQueryParam(router: Router, activatedRoute: ActivatedRoute, queryParams: Params): void {
  void router.navigate([], {
    queryParams,
    relativeTo: activatedRoute,
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
}
