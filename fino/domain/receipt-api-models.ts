export const API_BASE_URL = 'receipts';
export const RECEIPT_NAME_PATH_PARAM = 'receiptName';

export const RECEIPT_API_URLS = {
  CREATE: {
    URL: `/${API_BASE_URL}`,
    get: () => `api/${API_BASE_URL}`,
  },
  READ: {
    URL: `/${API_BASE_URL}/:${RECEIPT_NAME_PATH_PARAM}`,
    get: (receiptName: string) => `api/${API_BASE_URL}/${receiptName}`,
  },
  UPDATE: {
    URL: `/${API_BASE_URL}/:${RECEIPT_NAME_PATH_PARAM}`,
    get: (receiptName: string) => `api/${API_BASE_URL}/${receiptName}`,
  },
  DELETE: {
    URL: `/${API_BASE_URL}/:${RECEIPT_NAME_PATH_PARAM}`,
    get: (receiptName: string) => `api/${API_BASE_URL}/${receiptName}`,
  },
} as const;

export interface ReceiptApiResponse {
  Create: { name: string },
  Read: Buffer,
  Update: void,
  Delete: void,
}
