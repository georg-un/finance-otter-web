import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, QuerySnapshot } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { BalancesDTO, PurchaseDTO, UserDTO } from '../../../domain';
import { assertValidBalancesDoc, assertValidPurchaseDoc, assertValidUserDocs } from './firestore-validators';

function docToObject(document: DocumentSnapshot<DocumentData>): DocumentData | undefined {
    return document.data();
}

function collectionToArray(collection: QuerySnapshot<DocumentData>): DocumentData[] {
    return collection.docs.map(docToObject).filter(Boolean).map(x => x!);
}

export function getNewPurchaseRef(store: Firestore): DocumentReference<DocumentData> {
    return store.collection('purchases').doc();
}

export function getPurchaseRef(store: Firestore, id: string): DocumentReference<DocumentData> {
    return store.collection('purchases').doc(id);
}

export async function getPurchase(purchaseRef: DocumentReference<DocumentData>): Promise<PurchaseDTO> {
    const purchase = docToObject(await purchaseRef.get());
    if (!purchase) {
        throw new HttpsError('not-found', `Purchase with id '${purchaseRef.id}' not found.`);
    }
    assertValidPurchaseDoc(purchase);
    return purchase;
}

export function getBalancesRef(store: Firestore): DocumentReference<DocumentData> {
    return store.collection('balances').doc('default');
}

export async function getBalances(balancesRef: DocumentReference<DocumentData>): Promise<BalancesDTO> {
    const balances = docToObject(await balancesRef.get());
    assertValidBalancesDoc(balances);
    return balances
}

export function getUserCollectionRef(store: Firestore): CollectionReference<DocumentData> {
    return store.collection('users');
}

export async function getUsers(usersRef: CollectionReference<DocumentData>): Promise<UserDTO[]> {
    const users = collectionToArray(await usersRef.get())
    assertValidUserDocs(users);
    return users;
}

export async function getUserIds(usersRef: CollectionReference<DocumentData>): Promise<string[]> {
    return (await usersRef.get()).docs.map((doc) => doc.id).filter(Boolean);
}
