import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-no-style',
  template: `
    <p>
      no-style works!
    </p>
  `,
  styles: [
  ]
})
export class NoStyleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
