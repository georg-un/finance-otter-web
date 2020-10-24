export interface CategoryMonthSummary {
  name: string,
  series: CategorySummary[]
}

export interface CategorySummary {
  categoryId: number,
  value: number
}
