import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-multiline-snackbar',
  templateUrl: './multiline-snackbar.component.html',
  styleUrls: ['./multiline-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultilineSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

}
