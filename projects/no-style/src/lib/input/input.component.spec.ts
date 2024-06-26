import { InputComponentObjectModel } from '../../../tests/component-object-model/input-component-object-model';

describe('InputComponent', () => {
  let component: InputComponentObjectModel;

  describe("input type is text", () => {
    beforeEach(async () => {
      component = new InputComponentObjectModel();
      await component.setup()
    });
  
    it('should render a text input by default', () => {
      component.expect.inputTypeToBeText();
    });
  
    it('should have an accessible name via label', () => {
      component.expect.toHaveInputWithLabel();
    });
  
    it('should change form value with input text change', async() => {
      await component.fill('New value');
      component.expect.formToHaveValue('New value');
    });  
    // it('should reflect host styles using css variables', () => {});
  });

  describe('when validation set', () => {
    beforeEach(async () => {
      component = new InputComponentObjectModel();
      component.createFormWithValidators();
    })
    it('should display any reactive form errors if matching validation message is given', async () => {
      component.expect.NoErrorMessageDisplayed();

      await component.fillInvalidValue();
      component.expect.errorMessageDisplayed();
    });
  })

  describe('When input is disabled', () => {
    beforeEach(async() => {
      component = new InputComponentObjectModel();
      await component.createFormWithDisabledInput();
    });

    it('should show disabled styles', () => {
      component.expect.inputToBeDisabled();
      component.expect.inputToHaveDisabledStyles();
    });
  })

  describe('When select type is specified', () => {
    beforeEach(async() => {
      component = new InputComponentObjectModel();
      await component.setupSelectForm();
    });

    it('renders select if input type is select', () => {
      component.expect.inputTypeToBeSelect();
    });

    it('renders a list of given options', () => {
      component.expect.eachProvidedOptionToBeDisplayed();
    });

    it('should update form value for selected change', async() => {
      await component.selectAnOption();
      component.expect.formToHaveSelectedValue();
    });
  });

  describe('When radio type is specified', () => {
    beforeEach(async () => {
      component = new InputComponentObjectModel()
      await component.setupRadioForm();
    });

    it('renders radio group component if input type is radio', () => {
      component.expect.toBeRadioGroup()
    });

    it('should display the given label as a legend element', () => {
      component.expect.formToHaveLegendForRadioGroupWithLabelText();
    });

    it("should display a checkbox for each option", () => {
      component.expect.formToHaveInputWithTypeForEachOption("radio");
    });
  });

  describe('When checkbox type is specified with multiple options', () => {
    beforeEach(() => {
      component = new InputComponentObjectModel();
      component.createCheckBoxForm();
    });

    it('renders checkbox group component', () => {
      component.expect.toDisplayCheckboxGroup();
    });

    it('should display the given label as a legend element', () => {
      component.expect.formToHaveLegendWithLabelText();
    });

    it("should display a checkbox for each option", () => {
      component.expect.formToHaveInputWithTypeForEachOption("checkbox");
    });

  });

  describe('When checkbox type is specified with no options', () => {
    beforeEach(() => {
      component = new InputComponentObjectModel();
      component.createCheckBoxForm(false)
    });

    it('should render a single input', () => {
      component.expect.toDisplaySingleCheckbox();      
    });

    it('should have input type checkbox', () => {
      component.expect.inputTypeToBeCheckbox();
    })

    it('should have value true if checked', () => {
      component.inputWithLabel.click();
      component.expect.formToHaveValue(true);
    });
  });

  // describe('When date type is specified', () => {});
});