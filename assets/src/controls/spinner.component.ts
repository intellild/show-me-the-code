import { Component, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <fluent-progress-ring></fluent-progress-ring>
    <div *mobxAutorun class="text">{{ text }}</div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .text {
        margin-top: 10px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SpinnerComponent {
  get text() {
    return this.spinnerService.text;
  }

  constructor(private readonly spinnerService: SpinnerService) {}
}
