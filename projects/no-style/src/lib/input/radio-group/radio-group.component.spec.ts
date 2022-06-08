import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputModule } from '../input.module';

import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
  let component: TestReactiveFormHostComponent;
  let fixture: ComponentFixture<TestReactiveFormHostComponent>;
  let radioGroupComponent: RadioGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestReactiveFormHostComponent, RadioGroupComponent ],
      imports: [ InputModule, FormsModule, ReactiveFormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReactiveFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    radioGroupComponent = component.radioGroup;
    radioGroupComponent.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2'},
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(radioGroupComponent).toBeTruthy();
  });

  it('should display the given label as a legend element', () => {
    radioGroupComponent.label = 'Contact';
    fixture.detectChanges();

    const legend = fixture.debugElement.query(By.css('legend'));
    expect(legend.nativeElement.innerHTML).toContain('Contact');
  });

  it('renders a list of given options, wrapped in accessible label', () => {
    const labelElements = fixture.debugElement.queryAll(By.css('label'));
    expect(labelElements.length).toBe(2);

    const isAllLabelsContainingInput = () => Array.from(labelElements).every(label => label.nativeElement.innerHTML.includes('input'));
    expect(isAllLabelsContainingInput()).toBeTrue();
  });

  it('should emit change event for radio change', () => {
    spyOn(radioGroupComponent.valueChange, 'emit');
    const nativeInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    nativeInputElement.click();
    fixture.detectChanges();

    expect(radioGroupComponent.valueChange.emit).toHaveBeenCalled();
  });

  it('should change the order of input and label depending on input', () => {

  });
});


@Component({
  template: `
    <form [formGroup]="form">
      <ns-radio-group #radioGroup label="Test" formControlName="test"></ns-radio-group>
    </form>
  `
,
})
export class TestReactiveFormHostComponent {
  @ViewChild(RadioGroupComponent)
  public radioGroup!: RadioGroupComponent;

  form: FormGroup =  new FormGroup({
    test: new FormControl(''),
  });
}
