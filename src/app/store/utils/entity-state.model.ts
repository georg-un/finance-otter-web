export interface Dictionary<T> {
  [id: string]: T | undefined;
}

export interface EntityStateModel<T> {
  entities: Dictionary<T>;
  entityIds: string[];
}
