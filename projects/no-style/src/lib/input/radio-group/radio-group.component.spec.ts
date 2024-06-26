import '@testing-library/jest-dom';
import { RadioGroupComponent } from './radio-group.component';
import { render, RenderResult } from '@testing-library/angular';



describe('RadioGroupComponent', () => {
  let testComponent: TestComponent;

  beforeEach(async () => {
    testComponent = new TestComponent();
    await testComponent.setup();
  });

  it('renders matching count of radio items', () => {
    testComponent.expect.toHaveRadioOptionsWithLengthMatchingProvidedOptions();
  })

  it('renders a labelled radio input for each option', () => {
    testComponent.expect.eachOptionToHaveMatchingLabelledRadioInput();
  });

});

class TestComponent {
  readonly expect: TestComponentAssertions;
  readonly options =  [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  screen: RenderResult<RadioGroupComponent>;
  
  constructor() {
    this.expect = new TestComponentAssertions(this)
  }

  async setup() {
    this.screen = await render(RadioGroupComponent, { 
      componentProperties: { options: this.options }
    })
  }

  get radioOptions(): HTMLElement[] {
    return this.screen.getAllByRole("radio");
  }

  getByLabelText(text: string): HTMLInputElement {
    return this.screen.getByLabelText(text) as HTMLInputElement;
  }
}

class TestComponentAssertions {  
  constructor (readonly component: TestComponent) {}

  eachOptionToHaveMatchingLabelledRadioInput() {
    this.component.options.forEach(option => 
      expect(this.component.getByLabelText(option.label).type).toBe('radio')
    )
  }

  toHaveRadioOptionsWithLengthMatchingProvidedOptions() {
    expect(this.component.radioOptions.length).toBe(this.component.options.length);
  }
}
