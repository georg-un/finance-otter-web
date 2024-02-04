import { Application, Request, Response } from 'express';
import { HttpsError } from 'firebase-functions/v2/https';
import { handleErrors } from '../middleware/error-handler';
import * as firebase from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { isString } from '../../../domain';
import { RECEIPT_API_URLS, ReceiptApiResponse, RECEIPT_NAME_PATH_PARAM, PURCHASE_ID_PATH_PARAM } from '../../../domain/receipt-api-models';
import { deleteReceiptFromPurchase } from './purchase-api';

export const registerReceiptApi = (app: Application) => {
    app.post(RECEIPT_API_URLS.CREATE.URL, addReceipt);
    app.get(RECEIPT_API_URLS.READ.URL, getReceipt);
    app.put(RECEIPT_API_URLS.UPDATE.URL, updateReceipt);
    app.delete(RECEIPT_API_URLS.DELETE.URL, deleteReceipt);
    app.delete(RECEIPT_API_URLS.DELETE_FOR_EXISTING_PURCHASE.URL, deleteReceiptForExistingPurchase);
};

const addReceipt = handleErrors(async (req: Request, res: Response<ReceiptApiResponse['Create']>): Promise<void> => {
    const image = getImageFromRequestBody(req);

    const store = firebase.storage();
    const filename = uuidv4() + '.png';
    await store.bucket().file(getFilePath(filename)).save(image, {
        contentType: 'image/png',
        preconditionOpts: { ifGenerationMatch: 0 }
    });

    res.status(200).json({
        name: filename,
    });
});

const getReceipt = handleErrors(async (req: Request, res: Response<ReceiptApiResponse['Read']>): Promise<void> => {
    const filename = getReceiptNameFromPath(req);

    const store = firebase.storage();
    const file = store.bucket().file(getFilePath(filename));
    if ((await file.exists())[0]) {
        const content = await file.download();
        res.status(200).send(content[0]);
    } else {
        res.status(404).send();
    }
});

const deleteReceipt = handleErrors(async (req: Request, res: Response<ReceiptApiResponse['Delete']>): Promise<void> => {
    const filename = getReceiptNameFromPath(req);

    const store = firebase.storage();
    await store.bucket().file(getFilePath(filename)).delete();

    res.status(204).send();
});

const deleteReceiptForExistingPurchase = handleErrors(async (req: Request, res: Response<ReceiptApiResponse['DeleteForExistingPurchase']>): Promise<void> => {
    const filename = getReceiptNameFromPath(req);
    const purchaseId = getPurchaseIdFromPath(req);

    if (purchaseId) {
        await deleteReceiptFromPurchase(purchaseId);
    }

    const store = firebase.storage();
    await store.bucket().file(getFilePath(filename)).delete();

    res.status(204).send();
});

const updateReceipt = handleErrors(async (req: Request, res: Response<ReceiptApiResponse['Update']>): Promise<void> => {
    const filename = getReceiptNameFromPath(req);
    const image = getImageFromRequestBody(req);

    const store = firebase.storage();
    await store.bucket().file(getFilePath(filename)).save(image, {
        contentType: 'image/png',
        preconditionOpts: { ifGenerationNotMatch: 0 }
    });

    res.status(200).send();
});

const getReceiptNameFromPath = (req: Request): string => {
    const filename = req.params[RECEIPT_NAME_PATH_PARAM];
    if (!isString(filename)) {
        throw new HttpsError('invalid-argument', 'No image name provided.');
    }

    return filename;
};

const getPurchaseIdFromPath = (req: Request): string => {
    const purchaseId = req.params[PURCHASE_ID_PATH_PARAM];
    if (!isString(purchaseId)) {
        throw new HttpsError('invalid-argument', 'No purchase id provided.');
    }

    return purchaseId;
}

const getImageFromRequestBody = (req: Request): Buffer => {
    const image = req.body;
    if (!image) {
        throw new HttpsError('invalid-argument', 'No image provided.');
    }
    if (!Buffer.isBuffer(image)) {
        throw new HttpsError('invalid-argument', 'Image must be of type Buffer.');
    }

    return image;
};

export const getFilePath = (filename: string): string => {
    return `receipts/${filename}`
}
