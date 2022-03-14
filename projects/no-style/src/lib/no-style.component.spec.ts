import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoStyleComponent } from './no-style.component';

describe('NoStyleComponent', () => {
  let component: NoStyleComponent;
  let fixture: ComponentFixture<NoStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
