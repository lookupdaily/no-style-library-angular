import { Type } from "@angular/core";
import { RenderComponentOptions, RenderResult, render } from "@testing-library/angular";
import userEvent, { UserEvent } from "@testing-library/user-event";

export class ComponentObjectModel<T> {
  instance: T;
  screen: RenderResult<T>;
  user: UserEvent

  async baseSetup(componentType: Type<T>, renderComponentOptions: RenderComponentOptions<T>) {
    this.screen = await render(componentType, renderComponentOptions )
    this.instance = this.screen.fixture.componentInstance;
    this.user = userEvent.setup();
  }

  get checkboxes(): HTMLElement[] {
    return this.screen.getAllByRole("checkbox");
  }

  get form(): HTMLElement {
    return this.screen.getByRole("form");
  }

  getByLabel(label: string): HTMLInputElement | null {
    return this.screen.getByLabelText(label) as HTMLInputElement;
  }
}
