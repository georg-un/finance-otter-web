import { isObject, isString } from './type-guards';

export interface UserDTO {
    displayName: string;
    email: string;
    photoUrl?: string;
    uid: string;
}

export const isUserDTO = (val: unknown): val is UserDTO => {
    return isObject(val) &&
        isString((val as UserDTO).displayName) &&
        isString((val as UserDTO).email);
}
