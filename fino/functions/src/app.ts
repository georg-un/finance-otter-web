import { initializeApp } from 'firebase-admin/app';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { registerPurchaseApi } from './api/purchase-api';
import { errorHandler } from './middleware/error-handler';

initializeApp();
const app = express();

registerPurchaseApi(app);

app.use(errorHandler);  // must be at the end of the configuration
exports.api = functions.https.onRequest(app);
