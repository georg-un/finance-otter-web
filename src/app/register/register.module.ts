import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatInputModule } from "@angular/material";



@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class RegisterModule { }
