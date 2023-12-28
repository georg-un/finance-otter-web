export type WithUid<T> = T & {
  uid: string;
}

export const addUid = <T>(object: T, uid: string): WithUid<T> => {
  return { ...object, uid };
}
