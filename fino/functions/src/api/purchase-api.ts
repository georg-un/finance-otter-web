/* eslint-disable quotes */
import { firestore } from 'firebase-admin';
import { BalancesDTO, DebitDTO, isNumber, isObject, isString, PurchaseDTO } from '../../../domain';
import { Application, Request, Response } from 'express';
import {
  getBalances,
  getBalancesRef,
  getNewPurchaseRef,
  getPurchase,
  getPurchaseRef,
  getUserCollectionRef,
  getUserIds,
} from '../firestore/firestore-client';
import { handleErrors } from '../middleware/error-handler';
import { HttpsError } from 'firebase-functions/v2/https';
import { PURCHASE_API_URLS, PURCHASE_ID_PATH_PARAM, PurchaseApiResponse } from '../../../domain/purchase-api-models';

export const registerPurchaseApi = (app: Application) => {
  app.post(PURCHASE_API_URLS.CREATE.URL, addPurchase);
  app.put(PURCHASE_API_URLS.UPDATE.URL, updatePurchase);
  app.delete(PURCHASE_API_URLS.DELETE.URL, deletePurchase);
};

const addPurchase = handleErrors(async (req: Request, res: Response<PurchaseApiResponse['Create']>): Promise<void> => {
  const purchase = req.body as PurchaseDTO;
  const db = firestore();

  const newPurchaseRef = getNewPurchaseRef(db);
  const balancesRef = getBalancesRef(db);
  const usersRef = getUserCollectionRef(db);

  await db.runTransaction(async (transaction) => {
    const userIds = await getUserIds(usersRef);
    validatePurchase(purchase, userIds);

    const balances = await getBalances(balancesRef);

    transaction.set(newPurchaseRef, purchase);
    transaction.update(balancesRef, buildBalancesUpdate(balances, purchase, 'add'));
  });

  res.json({ id: newPurchaseRef.id });
});

const deletePurchase = handleErrors(async (req: Request, res: Response<PurchaseApiResponse['Delete']>): Promise<void> => {
  const purchaseId = req.params[PURCHASE_ID_PATH_PARAM];
  const db = firestore();

  const purchaseRef = getPurchaseRef(db, purchaseId);
  const balancesRef = getBalancesRef(db);

  await db.runTransaction(async (transaction) => {
    const purchase = await getPurchase(purchaseRef);
    const balances = await getBalances(balancesRef);

    transaction.update(balancesRef, buildBalancesUpdate(balances, purchase, 'remove'));
    transaction.delete(purchaseRef);
  });

  res.status(204).send();
});

const updatePurchase = handleErrors(async (req: Request, res: Response<PurchaseApiResponse['Update']>): Promise<void> => {
  const purchaseId = req.params[PURCHASE_ID_PATH_PARAM];
  const purchaseUpdate = req.body as PurchaseDTO;
  const db = firestore();

  const purchaseRef = getPurchaseRef(db, purchaseId);
  const balancesRef = getBalancesRef(db);
  const usersRef = getUserCollectionRef(db);

  await db.runTransaction(async (transaction) => {
    const userIds = await getUserIds(usersRef);
    validatePurchase(purchaseUpdate, userIds);

    const oldPurchase = await getPurchase(purchaseRef);
    const balances = await getBalances(balancesRef);

    transaction.update(balancesRef, buildBalancesUpdate(
      buildBalancesUpdate(balances, oldPurchase, 'remove'),
      purchaseUpdate,
      'add')
    );
    transaction.update(purchaseRef, { ...purchaseUpdate });
  });

  res.status(204).send();
});

const buildBalancesUpdate = (balances: BalancesDTO, purchase: PurchaseDTO, operation: 'add' | 'remove'): BalancesDTO => {
  const signControl = operation === 'add' ? 1 : -1;
  const newBalances = { ...balances };
  Object.entries(purchase.debits).forEach(([debtorUid, amount]) => {
    newBalances[debtorUid] = (newBalances[debtorUid] ?? 0) - (amount * signControl);
  });
  newBalances[purchase.payerUid] += (Object.values(purchase.debits).reduce((a, b) => a + b, 0) * signControl);

  return newBalances;
};

function validatePurchase(purchase: PurchaseDTO, allUserIds: string[]): asserts purchase is PurchaseDTO {
  if (!isObject(purchase)) {
    throw new HttpsError('invalid-argument', `Purchase must be of type object but was of type '${typeof purchase}'.`);
  }
  if (!isNumber(purchase?.date)) {
    throw new HttpsError('invalid-argument', `Property 'date' is required and must be of type number.`);
  }
  if (!isString(purchase?.payerUid)) {
    throw new HttpsError('invalid-argument', `Property 'payerUid' is required and must be of type string.`);
  }
  if (!allUserIds.includes(purchase?.payerUid)) {
    throw new HttpsError('invalid-argument', `Property 'payerUid' contains an unknown user-id: '${purchase?.payerUid}'.`);
  }
  if (!isString(purchase?.shop)) {
    throw new HttpsError('invalid-argument', `Property 'shop' is required and must be of type string.`);
  }
  validateDebits(purchase?.debits, allUserIds);
}

function validateDebits(debit: DebitDTO, allUserIds: string[]): asserts debit is DebitDTO {
  if (!isObject(debit)) {
    throw new HttpsError('invalid-argument', `Property 'debits' is required and must be of type object.`);
  }
  const debitUserIds = Object.keys(debit);
  if (debitUserIds.length < 1) {
    throw new HttpsError('invalid-argument', `Property 'debits' must contain debits but was empty.`);
  }
  if (!debitUserIds.every(isString)) {
    throw new HttpsError('invalid-argument', `Property 'debits' must contain only values of type string as user-ids.`);
  }
  debitUserIds.forEach(userId => {
    if (!allUserIds.includes(userId)) {
      throw new HttpsError('invalid-argument', `Property 'debits' contained unknown user-id '${userId}'.`);
    }
  });
  if (!Object.values(debit).every(isNumber)) {
    throw new HttpsError('invalid-argument', `Property 'debits' must contain only values of type number as amount.`);
  }
}
