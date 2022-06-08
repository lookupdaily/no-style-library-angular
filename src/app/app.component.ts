import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NSErrorMessage, NSInputOption } from 'projects/no-style/src/lib/input/input.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'no-styles-angular';

  form: FormGroup =  new FormGroup({
    test: new FormControl(''),
    test1: new FormControl('', Validators.max(10)),
  });

  errorMessages: NSErrorMessage[] = [{
    name: 'max',
    text: 'Value should be less than 10 characters',
    showErrorOnChange: true,
  }];

  options: NSInputOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2'},
  ];

  formControl(name: string): AbstractControl {
    return this.form.get(name) as AbstractControl;
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      console.log(this.form);
    })
  }
}
