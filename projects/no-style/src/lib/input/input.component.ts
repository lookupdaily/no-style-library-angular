import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { NSInputTypes } from './input.constants';
import { NSInputOption, NSInputType, NSErrorMessage } from './input.types';

let nextId = 0;
const classicInputTypes: NSInputType[] = [
  NSInputTypes.text,
  NSInputTypes.email,
  NSInputTypes.number,
  NSInputTypes.password,
  NSInputTypes.url,
];

@Component({
  selector: 'ns-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent,
    },
  ],
})
export class InputComponent implements OnChanges {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;
  @Input() formControl: FormControl | undefined;

  @Input() formControlName: string = '';
  @Input() name: string = '';
  @Input() disabled = false;
  @Input() label: string = '';
  @Input() type: NSInputType = 'text';
  @Input() options: NSInputOption[] = [];
  @Input() errorMessages: NSErrorMessage[] = [];

  @Input() showLabel = true;
  @Input() showError = true;

  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();

  readonly id: string = `NS-input-${nextId++}`;

  isInputType = true;
  inputTypes = NSInputTypes;

  get control() {
    return (
      this.formControl ||
      (this.controlContainer.control?.get(this.formControlName) as FormControl)
    );
  }

  get inputName(): string {
    return this.formControlName || this.name || this.id;
  }

  constructor(private controlContainer: ControlContainer) {}

  ngOnChanges({ type }: SimpleChanges): void {
    if (type) {
      this.isInputType = classicInputTypes.includes(this.type);
    }
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective?.valueAccessor?.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.formControlDirective?.valueAccessor) {
      this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
  }

  onChange($event: any): void {
    this.change.emit($event);
  }

  onBlur($event: any): void {
    this.blur.emit($event);
  }
}
