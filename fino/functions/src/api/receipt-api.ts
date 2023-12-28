import { Application, Request, Response } from 'express';
import { HttpsError } from 'firebase-functions/v2/https';
import { handleErrors } from '../middleware/error-handler';
import * as firebase from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { isString } from '../../../domain';
import { RECEIPT_API_URLS, ReceiptApiResponse, RECEIPT_NAME_PATH_PARAM } from '../../../domain/receipt-api-models';

export const registerReceiptApi = (app: Application) => {
    app.post(RECEIPT_API_URLS.CREATE.URL, addReceipt);
    app.get(RECEIPT_API_URLS.READ.URL, getReceipt);
    app.put(RECEIPT_API_URLS.UPDATE.URL, updateReceipt);
    app.delete(RECEIPT_API_URLS.DELETE.URL, deleteReceipt);
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

const getFilePath = (filename: string): string => {
    return `receipts/${filename}`
}
