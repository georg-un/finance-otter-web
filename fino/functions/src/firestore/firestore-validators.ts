import { BalancesDTO, isNumber, isObject, isString, isUserDTO, PurchaseDTO, UserDTO } from '../../../domain';
import { DocumentData } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/v2/https';
import { isPurchaseDTO } from '../../../domain/purchase-dto';

const INTERNAL_ERROR_MSG = 'Internal server error.';

export function assertValidPurchaseDoc(data: DocumentData | unknown): asserts data is PurchaseDTO {
    if (!isPurchaseDTO(data)) {
        logger.error(`Validation of purchase document failed. Received invalid purchase: ${JSON.stringify(data)}`);
        throw new HttpsError('internal', INTERNAL_ERROR_MSG);
    }
}

export function assertValidBalancesDoc(data: DocumentData | unknown): asserts data is BalancesDTO {
    if (!isObject(data) || !Object.entries(data).every(([key, value]) => isString(key) && isNumber(value))) {
        logger.error(`Validation of balances document failed. Received document: ${JSON.stringify(data, null, 2)}`);
        throw new HttpsError('internal', INTERNAL_ERROR_MSG);
    }
}

export function assertValidUserDocs(data: DocumentData[] | unknown): asserts data is UserDTO[] {
    if (!Array.isArray(data) || data.length < 1) {
        logger.error(`Validation of user documents failed. Either collection was no array or array was empty. Received: ${JSON.stringify(data, null, 2)}`);
        throw new HttpsError('internal', INTERNAL_ERROR_MSG);
    }
    data.forEach((user) => {
        if (!isUserDTO(user)) {
            logger.error(`Validation of user documents failed. Received invalid user: ${JSON.stringify(user)}`);
            throw new HttpsError('internal', INTERNAL_ERROR_MSG);
        }
    })
}