import { Pipe, PipeTransform } from '@angular/core';
import { Debits } from '../model/purchase';

@Pipe({
  standalone: true,
  name: 'debitSum'
})
export class DebitSumPipe implements PipeTransform {
  transform(debits: Debits): number {
    return Object.values(debits).reduce((a, b) => a + b, 0);
  }
}
