import { Component, NO_ERRORS_SCHEMA, SimpleChange, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputComponent } from './input.component';
import { InputModule } from './input.module';

describe('InputComponent', () => {
  let component: TestReactiveFormHostComponent;
  let fixture: ComponentFixture<TestReactiveFormHostComponent>;
  let inputComponent: InputComponent;

  const createSimpleChange = (newValue: any): SimpleChange => {
    return new SimpleChange(null, newValue, true);
  }

  const getInputElement = (): HTMLInputElement => {
    return fixture.debugElement.query(By.css('input')).nativeElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestReactiveFormHostComponent, InputComponent ],
      imports: [ InputModule, FormsModule, ReactiveFormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReactiveFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputComponent = component.input;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a text input by default', () => {
    const input = getInputElement();
    expect(input.type).toBe('text');
  });

  it('should have an accessible name via label', () => {
    inputComponent.label = 'Address';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.innerHTML).toContain('Address');
  });

  it('should emit change event for text field value change', () => {
    spyOn(inputComponent.change, 'emit');
    const nativeInputElement = getInputElement();
    const event = new Event('input');

    nativeInputElement.value = 'Test';
    nativeInputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(inputComponent.change.emit).toHaveBeenCalledWith(event);
  });

  it('should emit blur event for text field value change on blur', () => {
    spyOn(inputComponent.blur, 'emit');
    const nativeInputElement = getInputElement();
    const event = new Event('blur');

    nativeInputElement.value = 'Test';
    nativeInputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(inputComponent.blur.emit).toHaveBeenCalledWith(event);
  });

  it('should display any reactive form errors if matching validation message is given', () => {
    const errorMessages = [{
      name: 'maxlength',
      text: 'Value should be less than 5 characters',
      showErrorOnChange: true,
    }];
    inputComponent.errorMessages = errorMessages;
    component.form = new FormGroup({
      test: new FormControl('', Validators.maxLength(5)),
    })
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).not.toContain('Value should be less than 5 characters');

    const nativeInputElement = getInputElement();
    nativeInputElement.value = 'TestError';
    nativeInputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Value should be less than 5 characters');
  });

  it('should show disabled syles', () => {
    spyOn(inputComponent.change, 'emit');
    component.form = new FormGroup({
      test: new FormControl({value: 'Nancy', disabled: true}),
    })
    fixture.detectChanges();

    const nativeInputElement = getInputElement();
    expect(nativeInputElement.disabled).toBeTrue();
    expect(nativeInputElement.classList).toContain('disabled');
  });

  it('should reflect host styles using css variables', () => {

  });

  describe('When select type is specified', () => {
    beforeEach(() => {
      inputComponent.type = 'select';
      inputComponent.ngOnChanges({type: createSimpleChange(inputComponent.type)});
      fixture.detectChanges();
    });

    it('renders select if input type is select', () => {
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
    });

    it ('renders a list of given options', () => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2'},
      ];
      inputComponent.options = options;
      fixture.detectChanges();
      const optionsElements = fixture.debugElement.queryAll(By.css('option'));

      expect(optionsElements.length).toBe(2);
    });

    it('should emit change event for text field value change', () => {
      spyOn(inputComponent.change, 'emit');
      const nativeInputElement = fixture.debugElement.query(By.css('select')).nativeElement;
      const event = new Event('change');
      nativeInputElement.value = 'TestError';
      nativeInputElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(inputComponent.change.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('When radio type is specificed', () => {
    beforeEach(() => {
      inputComponent.type = 'radio';
      inputComponent.options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2'},
      ];
      inputComponent.ngOnChanges({type: createSimpleChange(inputComponent.type)});
      fixture.detectChanges();
    });

    it('renders radio group component if input type is radio', () => {
      const radioGroupComponent = fixture.debugElement.query(By.css('ns-radio-group'));
      expect(radioGroupComponent).toBeTruthy();
    });

    it('should listen for change event and emit change', () => {
      spyOn(inputComponent.change, 'emit');
      const event = new Event('valueChange');
      const radioGroupComponent = fixture.debugElement.query(By.css('ns-radio-group')).nativeElement;
      radioGroupComponent.dispatchEvent(event);
      expect(inputComponent.change.emit).toHaveBeenCalled();
    });
  });

  describe('When checkbox type is specified', () => {

  });

  describe('When date type is specified', () => {

  });
});

@Component({
  template: `
    <form [formGroup]="form">
      <ns-input #input label="Test" formControlName="test"></ns-input>
    </form>
  `
,
})
export class TestReactiveFormHostComponent {
  @ViewChild(InputComponent)
  public input!: InputComponent;

  form: FormGroup =  new FormGroup({
    test: new FormControl(''),
  });
}
