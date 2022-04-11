import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputComponent } from './input.component';
import { InputModule } from './input.module';

describe('InputComponent', () => {
  let component: TestReactiveFormHostComponent;
  let fixture: ComponentFixture<TestReactiveFormHostComponent>;
  let inputComponent: InputComponent;

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
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('text');
  });

  it('should have an accessible name via label', () => {
    inputComponent = component.input;
    inputComponent.label = 'Address';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.innerHTML).toContain('Address');
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
    test: new FormControl({value: 'Nancy', disabled: true}),
    test1: new FormControl(''),
  });
}
