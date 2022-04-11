import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NSErrorMessage } from 'projects/no-style/src/lib/input/input.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'no-styles-angular';

  form: FormGroup =  new FormGroup({
    test: new FormControl({value: 'Nancy', disabled: true}),
    test1: new FormControl('', Validators.max(10)),
  });

  errorMessages: NSErrorMessage[] = [{
    name: 'max',
    text: 'Value should be less than 10 characters',
    showErrorOnChange: true,
  }];

  formControl(name: string): AbstractControl {
    return this.form.get(name) as AbstractControl;
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      console.log(this.form);
    })
  }
}
