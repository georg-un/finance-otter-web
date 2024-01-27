export const API_BASE_URL = 'api/purchases';
export const PURCHASE_ID_PATH_PARAM = 'purchaseId';

export const PURCHASE_API_URLS = {
  CREATE: {
    URL: `/${API_BASE_URL}`,
    get: () => `${API_BASE_URL}`,
  },
  UPDATE: {
    URL: `/${API_BASE_URL}/:${PURCHASE_ID_PATH_PARAM}`,
    get: (purchaseId: string) => `${API_BASE_URL}/${purchaseId}`,
  },
  DELETE: {
    URL: `/${API_BASE_URL}/:${PURCHASE_ID_PATH_PARAM}`,
    get: (purchaseId: string) => `${API_BASE_URL}/${purchaseId}`,
  },
} as const;

export interface PurchaseApiResponse {
  Create: { id: string },
  Update: void,
  Delete: void,
}
