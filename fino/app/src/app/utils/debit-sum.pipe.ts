import { Pipe, PipeTransform } from '@angular/core';
import { DebitDTO } from '../../../../domain';

@Pipe({
  standalone: true,
  name: 'debitSum'
})
export class DebitSumPipe implements PipeTransform {
  transform(debits: DebitDTO): number {
    return Object.values(debits).reduce((a, b) => a + b, 0);
  }
}
