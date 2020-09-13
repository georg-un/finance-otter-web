import { Pipe, PipeTransform } from "@angular/core";
import { User } from '../../core/entity/user';

@Pipe({name: 'shortName'})
export class ShortNamePipe implements PipeTransform {
  transform(user: User): string {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName.charAt(0)}.`
    } else if (user && user.firstName) {
      return user.firstName;
    } else if (user && user.lastName) {
      return user.lastName
    } else {
      return '';
    }
  }
}
