import { initializeApp } from 'firebase-admin/app';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { registerPurchaseApi } from './api/purchase-api';
import { errorHandler } from './middleware/error-handler';
import { registerReceiptApi } from './api/receipt-api';

const BUCKET_ADDRESS = ''; // TODO: move to env file

initializeApp({
    storageBucket: BUCKET_ADDRESS,
});

const app = express();

registerPurchaseApi(app);
registerReceiptApi(app);
app.use(errorHandler);  // must be at the end of the configuration

exports.api = functions.https.onRequest(app);
