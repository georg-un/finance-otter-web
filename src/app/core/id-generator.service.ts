import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  constructor() { }

  generateId(): string {
    return this.getJTI() + '.' + new Date().getTime().toString();
  }

  private getJTI(): string {
    return 'toDo'  // TODO: This should get the JWT JTI
  }

}
