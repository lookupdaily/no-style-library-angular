import { DebugElement, Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

export class ComponentObjectModel<T> {
  readonly fixture: ComponentFixture<T>;
  readonly instance: T;
  readonly screen: DebugElement;
  constructor(componentType: Type<T>, detectChangesOnInit = true) {
    this.fixture = TestBed.createComponent(componentType);
    this.instance = this.fixture.componentInstance;
    this.screen = this.fixture.debugElement;

    if (detectChangesOnInit) {
      this.fixture.detectChanges();
    }
  }

  get input(): HTMLInputElement {
    return this.getElementBy<HTMLInputElement>('input');
  }

  get labels(): DebugElement[] {
    return this.screen.queryAll(By.css('label'));
  }

  getAllBy(selector: string): DebugElement[] {
    return this.screen.queryAll(By.css(selector));
  }

  getDebugElementBy(type: string): DebugElement {
    return this.screen.query(By.css(type))
  }

  getElementBy<T extends HTMLElement>(type: string) {
    return this.getDebugElementBy(type).nativeElement as T;
  }

  getElementById<T extends HTMLElement>(id: string, elementType?: string) {
    const idSelector = `#${id}`;
    const selector = elementType ? elementType + idSelector : idSelector; 
    return this.getElementBy<T>(selector);
  }

  getLabelWithText(label: string): HTMLElement {
    return this.labels.find(this.elementHasText(label)).nativeElement;
  }

  elementHasText(label: string): (value: DebugElement, index: number, obj: DebugElement[]) => boolean {
    return item => item.nativeElement.innerHTML.includes(label);
  }

  getByLabel(label: string): HTMLInputElement {
    const labelElement = this.getLabelWithText(label);
    const forAttribute = labelElement.getAttribute('for');
    return this.getElementById<HTMLInputElement>(forAttribute, 'input');
  } 

  detectChanges() {
    this.fixture.detectChanges();
  }
}
