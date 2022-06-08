import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioGroupComponent } from './radio-group/radio-group.component';


@NgModule({
  declarations: [InputComponent, RadioGroupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [InputComponent, RadioGroupComponent],
})
export class InputModule { }
