import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NSInputOption } from '../input.types';

const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxGroupComponent),
  multi: true,
};

@Component({
  selector: 'ns-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['../input.component.scss'],
  providers: [CHECKBOX_VALUE_ACCESSOR],
})
export class CheckboxGroupComponent
  implements OnChanges, ControlValueAccessor, OnDestroy, AfterViewInit
{
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() options: NSInputOption[] = [];
  @Input() showLabel = true;
  @Input() id;

  @Output() valueChange = new EventEmitter();

  form: FormGroup;
  get formArray(): FormArray {
    return this.form.controls['checkboxes'] as FormArray;
  }

  private subscriptions = new Subscription();
  private innerValue: string | string[] = '';
  private stringValue: string = '';
  get value(): string | string[] {
    return this.innerValue;
  }

  set value(v: string | string[]) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onValueChange(v);
    }
  }

  constructor() {
    this.form = new FormGroup({
      checkboxes: new FormArray([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.formArray?.clear();
      changes['options'].currentValue?.forEach(() => {
        this.formArray.push(new FormControl(false));
      });
    }
  }

  ngAfterViewInit(): void {
    const valueChange$ = this.formArray.valueChanges.subscribe((value) =>
      this.onCheckboxGroupChange(value)
    );
    this.subscriptions.add(valueChange$);
  }

  onCheckboxGroupChange(value): void {
    const newValue = this.getOutsideValue(value);
    if (this.valueChanged(newValue)) {
      this.onValueChange(newValue);
    }
  }

  getControl(i: number): FormControl {
    return this.formArray.controls[i] as FormControl;
  }

  onChange = (value: any) => {};
  onTouched = (value: any) => {};

  writeValue(value: string | string[]) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.stringValue = Array.isArray(this.value)
        ? this.value.join(',')
        : this.value;
      const valueCheck = this.getOutsideValue(this.formArray.value);
      if (this.valueChanged(valueCheck)) {
        let newValue = [];
        this.options?.forEach((option, index) => {
          newValue.push(this.value.includes(option.value));
        });
        this.formArray.setValue(newValue);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onValueChange(value: string | string[]) {
    this.innerValue = value;
    this.stringValue = Array.isArray(this.value)
      ? this.value.join(',')
      : this.value;
    this.onChange(value);
    this.onTouched(value);
    this.valueChange.emit(value);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  private getOutsideValue(value): string | string[] {
    const newCheckedValues = this.getCheckedFormValues(value);
    return Array.isArray(this.value)
      ? newCheckedValues
      : newCheckedValues.join(',');
  }

  private getCheckedFormValues(value): string[] {
    return this.options
      .filter((option, i) => value[i])
      .map((option) => option.value);
  }

  private valueChanged(value: string | string[]): boolean {
    const newValueString: string = Array.isArray(value)
      ? value.join(',')
      : value;
    return newValueString !== this.stringValue;
  }
}
