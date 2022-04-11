import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from './input/input.module';



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputModule,
  ],
  exports: [
    InputModule,
  ],
})
export class NoStyleModule { }
