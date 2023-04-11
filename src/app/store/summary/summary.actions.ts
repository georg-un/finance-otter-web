export class FetchBalances {
  public static readonly type = '[SUMMARY] Fetch balances';
}

export class FetchCategorySummary {
  public static readonly type = '[SUMMARY] Fetch category summary';
  public static readonly payload: { months: number };
  constructor(public payload: typeof FetchCategorySummary.payload) {
  }
}

export class FetchCategoryByMonthSummary {
  public static readonly type = '[SUMMARY] Fetch category-by-month summary';
  public static readonly payload: { months: number };
  constructor(public payload: typeof FetchCategoryByMonthSummary.payload) {
  }
}
