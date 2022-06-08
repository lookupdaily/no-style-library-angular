import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputModule } from '../input.module';

import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
  let component: TestReactiveFormHostComponent;
  let fixture: ComponentFixture<TestReactiveFormHostComponent>;
  let radioGroupComponent: RadioGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestReactiveFormHostComponent, RadioGroupComponent],
      imports: [InputModule, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReactiveFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    radioGroupComponent = component.radioGroup;
    radioGroupComponent.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(radioGroupComponent).toBeTruthy();
  });

  it('renders a list of given options, each with accessible label', () => {
    const radioItems = fixture.debugElement.queryAll(By.css('div'));
    expect(radioItems.length).toBe(2);

    const isAllLabelsContainingInput = () =>
      Array.from(radioItems).every(
        (radioItem) =>
          radioItem.nativeElement.innerHTML.includes('input') &&
          radioItem.nativeElement.innerHTML.includes('label')
      );
    expect(isAllLabelsContainingInput()).toBeTrue();
    expect(radioItems[0].nativeElement.innerHTML).toContain('Option 1');

  });

  it('should emit change event for radio change', () => {
    spyOn(radioGroupComponent.valueChange, 'emit');
    const nativeInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    nativeInputElement.click();
    fixture.detectChanges();

    expect(radioGroupComponent.valueChange.emit).toHaveBeenCalled();
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
