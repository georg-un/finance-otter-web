import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceiptScannerService {

  receipt: Blob;

  constructor() { }
}
