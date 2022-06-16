import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NSInputOption } from '../input.types';

const RADIO_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioGroupComponent),
  multi: true,
};

@Component({
  selector: 'ns-radio-group',
  providers: [RADIO_VALUE_ACCESSOR],
  templateUrl: './radio-group.component.html',
  styleUrls: ['../input.component.scss']
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() options: NSInputOption[] = [];
  @Input() showLabel = true;
  @Input() id;

  @Output() valueChange = new EventEmitter();

  private innerValue: string | number | boolean;
  get value(): string | number | boolean {
    return this.innerValue;
  }

  set value(v: string | number | boolean) {

    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onValueChange(v);
    }
  }

  onChange = (value: any) => {};
  onTouched = (value: any) => {};

  writeValue(value: string | number | boolean) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(value: string | number | boolean) {
    this.innerValue = value;
    this.onChange(value);
    this.onTouched(value);
    this.valueChange.emit(value);
  }

}
