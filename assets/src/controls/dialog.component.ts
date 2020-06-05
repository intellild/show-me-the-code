import { Component, Inject, InjectionToken } from '@angular/core';
import { Portal } from '@angular/cdk/portal';

export const DialogContentToken = new InjectionToken('DIALOG_CONTENT');

@Component({
  selector: 'app-dialog',
  template: ` <ng-template [cdkPortalOutlet]="content"></ng-template> `,
  styles: [
    `
      :host {
        background-color: #252526;
        box-shadow: #000 0 0 8px;
        color: #eeffff;
      }
    `,
  ],
})
export class DialogComponent {
  constructor(@Inject(DialogContentToken) readonly content: Portal<any>) {}
}
