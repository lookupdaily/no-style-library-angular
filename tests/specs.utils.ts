import { SimpleChange } from '@angular/core';

export class SpecsUtility {
  static createSimpleChange = (newValue: any): SimpleChange => {
    return new SimpleChange(null, newValue, true);
  };
}
