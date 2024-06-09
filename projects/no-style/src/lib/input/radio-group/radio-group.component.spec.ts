import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ComponentObjectModel } from 'tests/component-object-model/component-object-model';
import { InputModule } from '../input.module';

import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
  let testComponent: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestReactiveFormHostComponent, RadioGroupComponent],
      imports: [InputModule, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    testComponent = new TestComponent();
  });

  it('renders matching count of radio items', () => {
    testComponent.expect.toHaveRadioOptionsWithLengthMatchingProvidedOptions();
  })

  it('renders a labelled radio input for each option', () => {
    testComponent.expect.eachOptionToHaveMatchingLabelledRadioInput();
  });

  it('should update value of form when selecting an option', () => {
    testComponent.clickOnARadioOption();
    testComponent.expect.valueOfFormToChange() 
  });
});

@Component({
  template: `
    <form [formGroup]="form">
      <ns-radio-group
        #radioGroup
        label="Test"
        formControlName="test"
      ></ns-radio-group>
    </form>
  `,
})
export class TestReactiveFormHostComponent {
  @ViewChild(RadioGroupComponent)
  public radioGroup!: RadioGroupComponent;

  form: FormGroup = new FormGroup({
    test: new FormControl(''),
  });
}

class TestComponent extends ComponentObjectModel<TestReactiveFormHostComponent> {
  readonly expect: TestComponentAssertions;
  readonly options =  [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  
  readonly radioGroup = this.instance.radioGroup;
  constructor() {
    super(TestReactiveFormHostComponent, true)
    this.radioGroup.options = this.options;
    this.detectChanges()
    this.expect = new TestComponentAssertions(this)
  }

  get formValue(): string {
    return this.instance.form.get('test').value;
  }

  get radioOptions(): DebugElement[] {
    return this.screen.queryAll(By.css('input'));
  }

  clickOnARadioOption(): void {
    this.input.click();
    this.detectChanges();
  }
  
}

class TestComponentAssertions {  
  constructor (readonly component: TestComponent) {}

  eachOptionToHaveMatchingLabelledRadioInput() {
    this.component.options.forEach(option => 
      expect(this.component.getByLabel(option.label).type).toBe('radio')
    )
  }

  toHaveRadioOptionsWithLengthMatchingProvidedOptions() {
    expect(this.component.radioOptions.length).toBe(this.component.options.length);
  }

  valueOfFormToChange() {
    expect(this.component.formValue).toBe(this.component.options[0].value);
  }
}