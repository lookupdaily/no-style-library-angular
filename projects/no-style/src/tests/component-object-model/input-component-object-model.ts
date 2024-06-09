import { Component, DebugElement, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InputComponent } from "projects/no-style/src/lib/input/input.component";
import { ComponentObjectModel } from "tests/component-object-model/component-object-model";
import { SpecsUtility } from "tests/specs.utils";
import { NSInputTypes } from "../../lib/input/input.constants";
import { NSInputType } from "../../lib/input/input.types";

@Component({
  template: `
    <form [formGroup]="form">
      <ns-input #input label="Test" formControlName="test"></ns-input>
    </form>
  `,
})
export class ReactiveFormHostComponent {
  @ViewChild(InputComponent)
  public input!: InputComponent;

  form: FormGroup = new FormGroup({
    test: new FormControl(''),
  });
}

export class InputComponentObjectModel extends ComponentObjectModel<ReactiveFormHostComponent> {
  readonly expect: TestComponentAssertions;
  readonly inputComponent: InputComponent = this.instance.input;
  readonly errorMessages = [
    {
      name: 'maxlength',
      text: 'Value should be less than 5 characters',
      showErrorOnChange: true,
    },
  ];

  readonly options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  constructor() {
    super(ReactiveFormHostComponent, true)
    this.expect = new TestComponentAssertions(this);
  }

  get checkBoxGroup() {
    return this.getElementBy('ns-checkbox-group');
  }

  get formValue(): string | boolean {
    return this.instance.form.get('test').value;
  }

  get formLegendText(): string {
    const form = this.getElementBy<HTMLFormElement>('form');
    const legend = form.getElementsByTagName('legend')[0];
    return legend.innerHTML;
  }

  get elementText(): string {
    return this.screen.nativeElement.innerHTML;
  }

  get inputs(): DebugElement[] {
    return this.getAllBy('input');
  }

  get labelElement(): HTMLElement {
    return this.getElementBy('label');
  }

  get labelText(): string {
    return this.labelElement.innerHTML;
  }

  get radioGroup() {
    return this.getElementBy('ns-radio-group');
  }

  get selectInput(): HTMLSelectElement {
    return this.getElementBy<HTMLSelectElement>('select');
  }

  get selectOptions(): HTMLCollectionOf<HTMLOptionElement> {
    return this.selectInput.getElementsByTagName('option');
  }

  get selectOptionsCount(): number {
    return this.selectOptions.length;
  }
  
  getOptionWithText(text: string): any {
    return Array.from(this.selectOptions)
      .find(option => option.innerHTML.includes(text));
  }

  // ACTIONS
  createFormWithDisabledInput() {
    this.instance.form = new FormGroup({
      test: new FormControl({ value: 'Nancy', disabled: true }),
    });
    this.detectChanges();
  }

  createCheckBoxForm() {
    this.updateFormType(NSInputTypes.checkbox);
  }

  createFormWithValidators() {
    this.setErrorMessages();
    this.instance.form = new FormGroup({
      test: new FormControl('', Validators.maxLength(5)),
    });
    this.detectChanges();
  }

  createRadioForm() {
    this.updateFormType(NSInputTypes.radio);
    this.setOptions();
  }

  createSelectForm(): void {
    this.updateFormType('select');
    this.setOptions();
  }

  updateFormType(type: NSInputType): void {
    this.inputComponent.type = type;
    this.inputComponent.ngOnChanges({
        type: SpecsUtility.createSimpleChange(this.inputComponent.type),
      });
    this.detectChanges();
  }

  fill(text: string) {
    const inputElement = this.input;
    const event = new Event('input');
    inputElement.value = text;
    inputElement.dispatchEvent(event);
    this.detectChanges();
  }

  fillInvalidValue() {
    this.fill('TestErrorMessage');
  }

  mockRadioGroupValueChange() {
    spyOn(this.inputComponent.change, 'emit');
    this.radioGroup.dispatchEvent(new Event('valueChange'));
  }

  mockCheckBoxGroupValueChange() {
    spyOn(this.inputComponent.change, 'emit');
    this.checkBoxGroup.dispatchEvent(new Event('valueChange'));
  }

  selectAnOption() {
    const event = new Event('change');
    const selectElement = this.selectInput;
    selectElement.value = this.options[0].value;
    selectElement.dispatchEvent(event);
    this.detectChanges();
  }

  setErrorMessages(): void {
    this.inputComponent.errorMessages = this.errorMessages;
    this.detectChanges();
  }

  setFormValue(value: boolean) {
    this.instance.form.get('test').setValue(value);
    this.detectChanges();
  }

  setLabelText(text: string) {
    this.inputComponent.label = text;
    this.detectChanges();
  }

  setOptions(): void {
    this.inputComponent.options = this.options;
    this.detectChanges();
  }

  spyOnChange(): void {
    spyOn(this.inputComponent.change, 'emit');
  }

  updateInputLabel(text: string): void {
    this.inputComponent.label = text;
    this.detectChanges();
  }
}

class TestComponentAssertions {
  constructor(readonly component: InputComponentObjectModel) {}

  checkboxToBeChecked() {
    expect(this.component.input.checked).toBe(true);
  }
  
  eachProvidedOptionToBeDisplayed() {
    expect(this.component.selectOptionsCount).toBe(
      this.component.options.length
      );
    this.component.options.forEach(option => {
      expect(this.component.getOptionWithText(option.label)).toBeTruthy();
    })
  }

  errorMessageDisplayed() {
    expect(this.component.elementText).toContain(
      this.component.errorMessages[0].text
    );
  }

  NoErrorMessageDisplayed() {
    expect(this.component.elementText).not.toContain(
      this.component.errorMessages[0].text
    );
  }

  formToHaveLegendWithText(text: string) {
    expect(this.component.formLegendText).toBe(text);
  }

  formToHaveValue(value: string | boolean) {
    expect(this.component.formValue).toBe(value);
  }

  formToHaveSelectedValue() {
      this.formToHaveValue(this.component.options[0].value);
  }

  inputToBeDisabled() {
    expect(this.component.input.disabled).toBeTrue();
  }

  inputToHaveDisabledStyles() {
    expect(this.component.input.classList).toContain('disabled');
  }

  inputTypeToBeCheckbox() {
    expect(this.component.input.type).toBe('checkbox');  
  }

  inputTypeToBeSelect() {
    expect(this.component.selectInput).toBeTruthy();
  }

  inputTypeToBeText() {
    expect(this.component.input.type).toBe('text');  
  }

  inputTypeToBeNsRadioGroup() {
    expect(this.component.radioGroup).toBeTruthy();
  }

  eventToBeEmitted(eventName: string) {
    const event = new Event(eventName)
    expect(this.component.inputComponent.change.emit).toHaveBeenCalledWith(event);
  }

  labelToBe(text: string) {
    expect(this.component.labelText).toBe(text);
  }

  toDisplaySingleInput() {
    expect(this.component.inputs.length).toBe(1);
  }
}
