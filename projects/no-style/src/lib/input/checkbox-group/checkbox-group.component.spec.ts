import '@testing-library/jest-dom';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ComponentObjectModel } from '../../../../tests/component-object-model/component-object-model';
import { RenderComponentOptions } from '@testing-library/angular';
import { NSInputOption } from '../input.types';
import { CheckboxGroupComponent } from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponentObjectModel;

  describe('if associated with single form control', () => {
    beforeEach(async () => {
      component = new CheckboxGroupComponentObjectModel();
      await component.setup();
    });
  
    it('renders a list of given options, each with a label', () => {
      component.expect.toDisplayALabelledCheckboxForEachOption();
    });
  
    it('should update the form value to include only checked items', async () => {
      await component.selectACheckbox();
      component.expect.formToHaveSingleValue();
    });

    it('should update the form value if more than one checked item', async () => {
      await component.selectCheckboxes();
      component.expect.formToHaveMultipleValues();
    });

    it('should update the checkbox values rendered if the form value is changed programatically', () => {
      component.setFormValueToAllOptions();
      component.expect.allCheckboxesToBeChecked();
    });
  });

  describe('if associated with form control array', () => {
    beforeEach(async() => {
      component = new CheckboxGroupComponentObjectModel();
      await component.setupArrayForm();
    });

    it('renders a list of given options, each with a label', () => {
      component.expect.toDisplayALabelledCheckboxForEachOption();
    });

    it('should update the form value as array', async() => {
      await component.selectACheckbox()
      component.expect.formToHaveSingleValue();
    });

    it('should update the form value if more than one checked item', async () => {
      await component.selectCheckboxes();
      component.expect.formToHaveMultipleValues();
    });
  });
});

class CheckboxGroupComponentObjectModel extends ComponentObjectModel<ReactiveFormHostComponent | ReactiveFormArrayHostComponent> {
  setFormValueToAllOptions() {
    this.instance.form.get('test')?.setValue('1,2');
    this.screen.detectChanges();
  }

  async selectCheckboxes() {
    const checkboxes = this.checkboxes;
    await this.user.click(checkboxes[0]);
    await this.user.click(checkboxes[1]);
  }
  async selectACheckbox () {
    await this.user.click(this.checkboxes[0]);
  }
  readonly expect: TestComponentAssertions;
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  renderComponentOptions: RenderComponentOptions<ReactiveFormHostComponent> = {
    declarations: [CheckboxGroupComponent],
    imports: [ReactiveFormsModule, FormsModule],
    componentInputs: { options: this.options },
  };

  constructor() {
    super();
    this.expect = new TestComponentAssertions(this);
  }
  async setup() {
    await this.baseSetup(ReactiveFormHostComponent, this.renderComponentOptions);
  }

  async setupArrayForm() {
    await this.baseSetup(ReactiveFormArrayHostComponent, this.renderComponentOptions);
  }
}

class TestComponentAssertions {
  allCheckboxesToBeChecked() {
    this.component.checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    })
  };

  formToHaveMultipleValues() {
    this.formToHaveValue('1,2');
  }
  formToHaveSingleValue() {
    this.formToHaveValue('1');
  }

  constructor(readonly component: CheckboxGroupComponentObjectModel) {}

  formToHaveValue(value: string | boolean) {
    expect(this.component.screen.getByText(`Value: ${value}`)).toBeInTheDocument();
  }

  toDisplayALabelledCheckboxForEachOption() {
    this.component.options.forEach((option) => {
      const input = this.component.getByLabel(option.label);
      expect(input).toBeInTheDocument();
      expect(input?.type).toBe("checkbox");
    });
  }
}


@Component({
  template: `
    <form [formGroup]="form" name="form">
      <ns-checkbox-group
        #checkboxGroup
        label="Test"
        formControlName="test"
        [options]="options"
      ></ns-checkbox-group>
      <p>Value: {{ value }} </p>
    </form>
  `,
})
class ReactiveFormHostComponent {
  @Input() options: NSInputOption[] = [];
  form: FormGroup = new FormGroup({
    test: new FormControl(''),
  });

  get value() {
    return this.form.get('test')?.value;
  }
}

@Component({
  template: `
    <form [formGroup]="form" name="form">
      <ns-checkbox-group
        #checkboxGroupArray
        label="Test"
        formControlName="testArray"
        [options]="options"
      ></ns-checkbox-group>
      <p>Value: {{ value }}</p>
    </form>
  `,
})
class ReactiveFormArrayHostComponent {
  @Input() options: NSInputOption[] = [];
  form: FormGroup = new FormGroup({
    testArray: new FormControl([]),
  });

  get value() {
    return this.form.get('testArray')?.value.join(',');
  }
}