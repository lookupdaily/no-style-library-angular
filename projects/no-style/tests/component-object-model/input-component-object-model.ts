import '@testing-library/jest-dom';

import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NSInputTypes } from "../../src/lib/input/input.constants";
import { NSInputOption } from "../../src/lib/input/input.types";
import { RenderComponentOptions,  fireEvent } from "@testing-library/angular";
import { InputComponent } from "../../src/lib/input/input.component";
import { RadioGroupComponent } from "../../src/lib/input/radio-group/radio-group.component";
import { CheckboxGroupComponent } from "../../src/lib/input/checkbox-group/checkbox-group.component";
import { ComponentObjectModel } from './component-object-model';

@Component({
  template: `
    <form [formGroup]="form" name="form">
      <ns-input #input label="Test" formControlName="test" [errorMessages]="errorMessages" [options]="options"
      [type]="formType" [name]="test"></ns-input>
    </form>
  `,
  imports: [ReactiveFormsModule, InputComponent, RadioGroupComponent]
})
export class ReactiveFormHostComponent {
  @Input() options: NSInputOption[] | null;
  @Input() formType: NSInputTypes = NSInputTypes.text;

  errorMessages = [
    {
      name: 'maxlength',
      text: 'Value should be less than 5 characters',
      showErrorOnChange: true,
    },
  ]

  form: FormGroup = new FormGroup({
    test: new FormControl(''),
  });
}

export class InputComponentObjectModel extends ComponentObjectModel<ReactiveFormHostComponent> {
  readonly expect: TestComponentAssertions;
  

  readonly options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  constructor() {
    super()
    this.expect = new TestComponentAssertions(this);
  }

  async setup(componentInputs: RenderComponentOptions<ReactiveFormHostComponent>["componentInputs"] | null = null) {
    const renderComponentOptions = { declarations: [InputComponent, RadioGroupComponent, CheckboxGroupComponent], imports: [ReactiveFormsModule, FormsModule] }
    if (componentInputs) {
      renderComponentOptions["componentInputs"] = componentInputs;
    }

    await this.baseSetup(ReactiveFormHostComponent, renderComponentOptions);
  }

  get inputWithLabel(): HTMLInputElement {
    return this.screen.getByLabelText("Test") as HTMLInputElement;
  }



  getByLegendText(text: string): HTMLElement {
    return this.screen.getByRole('group', { name: text })
  }

  getByRadioLegendText(text: string): HTMLElement {
    return this.screen.getByRole('radiogroup', { name: text })
  }

  get radioGroup() {
    return this.screen.getByRole("radiogroup");
  }

  get selectInput(): HTMLElement {
    return this.screen.getByRole("combobox");
  }

  get selectOptions(): HTMLElement[] {
    return this.screen.getAllByRole('option');
  }

  get selectOptionsCount(): number {
    return this.selectOptions.length;
  }
  
  getOptionWithText(text: string): HTMLElement[] {
    return this.screen.getAllByRole("option", {name: text});
  }

  get errorText(): HTMLElement | null {
    return this.screen.queryByText(this.instance.errorMessages[0].text);
  }

  // ACTIONS
  async createFormWithDisabledInput() {
    await this.setup();
    this.instance.form.get('test')?.disable();
    this.screen.detectChanges()
  }

  createCheckBoxForm(withOptions = true) {
    this.updateFormType(NSInputTypes.checkbox, withOptions);
  }

  async createFormWithValidators() {
    await this.setup()
    this.instance.form.get('test')?.setValidators([Validators.maxLength(5)]);
  }

  async setupRadioForm(): Promise<void> {
    await this.updateFormType(NSInputTypes.radio, true);
  }

  async setupSelectForm(): Promise<void> {
    await this.updateFormType(NSInputTypes.select, true);
  }

  async updateFormType(formType: NSInputTypes, withOptions = false): Promise<void> {
    const componentProperties = { formType };
    if (withOptions) {
      componentProperties["options"] = this.options;
    }
    
    await this.setup(componentProperties);
  }

  async fill(text: string): Promise<void> {
    const input = this.inputWithLabel;
    await this.user.type(input, text);
    fireEvent.blur(input);
  }

  async fillInvalidValue(): Promise<void> {
    await this.fill('TestErrorMessage');
  }

  async selectAnOption(): Promise<void> {
    await this.user.selectOptions(this.selectInput, this.options[0].value);
  }
}

class TestComponentAssertions {
  constructor(readonly component: InputComponentObjectModel) {}
  
  eachProvidedOptionToBeDisplayed() {
    expect(this.component.selectOptionsCount).toBe(
      this.component.options.length
      );
    this.component.options.forEach(option => {
      expect(this.component.getOptionWithText(option.label)).toBeTruthy();
    })
  }

  errorMessageDisplayed() {
    expect(this.component.errorText).toBeInTheDocument();
  }

  NoErrorMessageDisplayed() {
    expect(this.component.errorText).not.toBeInTheDocument();
  }

  formToHaveLegendForRadioGroupWithLabelText() {
    expect(this.component.getByRadioLegendText("Test")).toBeInTheDocument();
  }

  formToHaveLegendWithLabelText() {
    expect(this.component.getByLegendText("Test")).toBeInTheDocument();
  }

  formToHaveValue(value: string | boolean) {
    expect(this.component.form).toHaveFormValues({test: value});
  }

  formToHaveSelectedValue() {
    this.formToHaveValue(this.component.options[0].value);     
  }

  inputToBeDisabled() {
    expect(this.component.inputWithLabel).toBeDisabled();
  }

  inputToHaveDisabledStyles() {
    expect(this.component.inputWithLabel).toHaveClass('disabled');
  }

  inputTypeToBeCheckbox() {
    expect(this.component.inputWithLabel.type).toBe('checkbox');  
  }

  inputTypeToBeSelect() {
    expect(this.component.selectInput).toBeInTheDocument();
  }

  inputTypeToBeText() {
    expect(this.component.inputWithLabel.type).toBe('text');  
  }

  toBeRadioGroup() {
    expect(this.component.radioGroup).toBeTruthy();
  }

  toDisplaySingleCheckbox() {
    expect(this.component.checkboxes.length).toBe(1);
  }

  toHaveInputWithLabel() {
    expect(this.component.inputWithLabel).toBeTruthy()
  }

  formToHaveInputWithTypeForEachOption(type: string) {
    this.component.options.forEach(option => {
      const input = this.component.getByLabel(option.label)
      expect(input).toBeTruthy();
      expect(input?.type).toBe(type);
    })
  }

  toDisplayCheckboxGroup() {
    const group = this.component.getByLegendText("Test");
    this.component.checkboxes.forEach(checkbox => {
      expect(group).toContainElement(checkbox);
    })
    expect(this.component.checkboxes.length).toBeGreaterThan(1);
  }
}
