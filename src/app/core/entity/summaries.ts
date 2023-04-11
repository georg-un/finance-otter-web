export interface Balances {
  [userId: string]: number;
}

export interface CategorySummary {
  categoryId: number;
  value: number;
}

export interface CategoryByMonthSummary {
  name: string;
  series: CategorySummary[];
}
