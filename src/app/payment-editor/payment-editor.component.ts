import { Component, OnInit } from '@angular/core';
import { MockRestService } from '../rest-service/mock-rest.service';
import { User } from '../rest-service/entity/user';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-payment-editor',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.scss']
})
export class PaymentEditorComponent implements OnInit {

  users: User[];
  customDistribution = false;

  constructor(private apiService: MockRestService) { }

  ngOnInit() {
    this.users = this.apiService.fetchUsers();
  }

  onDistributionToggleChange(change: MatSlideToggleChange): void {
    this.customDistribution = change.checked;
    if (!change.checked) {
      this.removeDebitValues();
    }
  }

  removeDebitValues(): void {
    // TODO: This is probably not necessary. [(ngModel)] should suffice but it depends the implementation of the distribution methods..
  }

  distributeToAllFields(): void {
    // TODO: This should distribute the rest equally to all fields.
  }

  distributeToEmptyFields(): void {
    // TODO: This should distribute the rest to empty fields only
  }

}
