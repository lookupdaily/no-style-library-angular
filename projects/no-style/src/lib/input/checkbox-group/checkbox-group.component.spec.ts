import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SpecsUtility } from 'projects/no-style/src/tests/specs.utils';
import { InputModule } from '../input.module';

import { CheckboxGroupComponent } from './checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: TestReactiveFormHostComponent;
  let fixture: ComponentFixture<TestReactiveFormHostComponent>;
  let checkboxGroupComponent: CheckboxGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestReactiveFormHostComponent, CheckboxGroupComponent],
      imports: [InputModule, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReactiveFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    checkboxGroupComponent = component.checkboxGroup;
    checkboxGroupComponent.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    checkboxGroupComponent.ngOnChanges({
      options: SpecsUtility.createSimpleChange(checkboxGroupComponent.options),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a list of given options, each with a label', () => {
    const checkboxItems = fixture.debugElement.queryAll(By.css('div'));
    expect(checkboxItems.length).toBe(2);

    const isAllItemsContainingInput = () =>
      Array.from(checkboxItems).every(
        (checkboxItem) =>
          checkboxItem.nativeElement.innerHTML.includes('input') &&
          checkboxItem.nativeElement.innerHTML.includes('label')
      );
    expect(isAllItemsContainingInput()).toBeTrue();
    expect(checkboxItems[0].nativeElement.innerHTML).toContain('Option 1');
  });

  it('should create a form array of given options', () => {
    expect(checkboxGroupComponent.formArray.controls.length).toBe(2);
  });

  it('should update the associated form value to include only checked items', () => {
    const nativeInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    nativeInputElement.click();
    fixture.detectChanges();

    expect(component.form.value.test).toBe('1');
  });

  it('associated form value should be of type array if form control is initialised with array', () => {
    const componentWithArray = component.checkboxGroupArray;
    componentWithArray.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    componentWithArray.ngOnChanges({
      options: SpecsUtility.createSimpleChange(checkboxGroupComponent.options),
    });
    fixture.detectChanges();
    const formControls = fixture.debugElement.queryAll(
      By.css('ns-checkbox-group')
    );

    const nativeInputElement = formControls[1].query(
      By.css('input')
    ).nativeElement;
    nativeInputElement.click();
    fixture.detectChanges();

    expect(component.form.value.testArray).toEqual(['1']);
  });

  it('should update the checkbox values rendered if the form value is changed programatically', () => {
    component.form.get('test').setValue('1,2');
    fixture.detectChanges();

    const checkboxes = fixture.debugElement.queryAll(By.css('input'));
    const isAllChecked = () =>
      Array.from(checkboxes).every(
        (checkbox) => checkbox.nativeElement.checked
      );
    expect(isAllChecked()).toBeTrue();
  });

  it('should emit change event for checkbox change', () => {
    spyOn(checkboxGroupComponent.valueChange, 'emit');

    const nativeInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    nativeInputElement.click();
    fixture.detectChanges();

    expect(checkboxGroupComponent.valueChange.emit).toHaveBeenCalledWith('1');
  });
});

@Component({
  template: `
    <form [formGroup]="form">
      <ns-checkbox-group
        #checkboxGroup
        label="Test"
        formControlName="test"
      ></ns-checkbox-group>
      <ns-checkbox-group
        #checkboxGroupArray
        label="Test"
        formControlName="testArray"
      ></ns-checkbox-group>
    </form>
  `,
})
export class TestReactiveFormHostComponent {
  @ViewChild('checkboxGroup')
  public checkboxGroup!: CheckboxGroupComponent;
  @ViewChild('checkboxGroupArray')
  public checkboxGroupArray!: CheckboxGroupComponent;

  form: FormGroup = new FormGroup({
    test: new FormControl(''),
    testArray: new FormControl([]),
  });
}
