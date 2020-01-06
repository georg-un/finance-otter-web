import { Pipe, PipeTransform } from "@angular/core";
import { User } from "../core/rest-service/entity/user";

@Pipe({name: 'shortName'})
export class ShortNamePipe implements PipeTransform {
  transform(user: User): string {
    return `${user.firstName} ${user.lastName.charAt(0)}.`
  }
}
