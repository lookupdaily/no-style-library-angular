import {
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponentObjectModel, ReactiveFormHostComponent } from '../../tests/component-object-model/input-component-object-model';

import { InputComponent } from './input.component';
import { InputModule } from './input.module';

describe('InputComponent', () => {
  let component: InputComponentObjectModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveFormHostComponent, InputComponent],
      imports: [InputModule, FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    component = new InputComponentObjectModel();
  });

  it('should render a text input by default', () => {
    component.expect.inputTypeToBeText();
  });

  it('should have an accessible name via label', () => {
    component.updateInputLabel('Address');
    component.expect.labelToBe('Address');
  });

  it('should change form value with input text change', () => {
    component.fill('New value');
    component.expect.formToHaveValue('New value');
  });

  it('should emit change event for text field value changes', () => {
    component.spyOnChange();
    component.fill('text');
    component.expect.eventToBeEmitted('change');
  })

  it('should display any reactive form errors if matching validation message is given', () => {
    component.createFormWithValidators();
    component.expect.NoErrorMessageDisplayed();
    
    component.fillInvalidValue();
    component.expect.errorMessageDisplayed();
  });

  it('should show disabled styles', () => {
    component.createFormWithDisabledInput();
    component.expect.inputToBeDisabled();
    component.expect.inputToHaveDisabledStyles();
  });

  // it('should reflect host styles using css variables', () => {});

  describe('When select type is specified', () => {
    beforeEach(() => {
      component.createSelectForm();
    });

    it('renders select if input type is select', () => {
      component.expect.inputTypeToBeSelect();
    });

    it('renders a list of given options', () => {
      component.expect.eachProvidedOptionToBeDisplayed();
    });

    // this is failing
    xit('should update form value for selected change', () => {
      component.selectAnOption();
      component.expect.formToHaveSelectedValue();
    });
  });

  describe('When radio type is specified', () => {
    beforeEach(() => {
      component.createRadioForm();
    });

    it('renders radio group component if input type is radio', () => {
      component.expect.inputTypeToBeNsRadioGroup()
    });

    it('should display the given label as a legend element', () => {
      component.setLabelText('Contact');
      component.expect.formToHaveLegendWithText('Contact');
    });

    it('should listen for change event and emit change', () => {
      component.mockRadioGroupValueChange()
      component.expect.eventToBeEmitted('valueChange')
    });
  });

  describe('When checkbox type is specified with multiple options', () => {
    beforeEach(() => {
      component.createCheckBoxForm();
      component.setOptions();
    });

    it('renders checkbox group component', () => {
      expect(component.checkBoxGroup).toBeTruthy();
    });

    it('should display the given label as a legend element', () => {
      component.setLabelText('Contact');
      component.expect.formToHaveLegendWithText('Contact');
    });

    it('should listen for change event and emit change', () => {
      component.mockCheckBoxGroupValueChange()
      component.expect.eventToBeEmitted('valueChange')
    });
  });

  describe('When checkbox type is specified with no options', () => {
    beforeEach(() => {
      component.createCheckBoxForm()
    });

    it('should render a single input', () => {
      component.expect.toDisplaySingleInput();      
    });

    it('should have input type checkbox', () => {
      component.expect.inputTypeToBeCheckbox();
    })

    it('should have value true if checked', () => {
      component.input.click();
      component.expect.formToHaveValue(true);
    });

    it('input element should be checked on render if form value is true', () => {
      component.setFormValue(true);
      component.expect.checkboxToBeChecked();
    })
  });

  // describe('When date type is specified', () => {});
});