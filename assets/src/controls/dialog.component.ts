import { Portal } from '@angular/cdk/portal';
import { Component, Inject, InjectionToken, ViewEncapsulation } from '@angular/core';

export const DialogContentToken = new InjectionToken('DIALOG_CONTENT');
export const DialogStyleToken = new InjectionToken('DIALOG_STYLE');

@Component({
  selector: 'app-dialog',
  template: `
    <fluent-dialog [style]="style">
      <ng-template [cdkPortalOutlet]="content"></ng-template>
    </fluent-dialog>
  `,
  styles: [
    `
      /*:host {*/
      /*  background-color: #252526;*/
      /*  box-shadow: #000 0 0 8px;*/
      /*  color: #eeffff;*/
      /*}*/
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DialogComponent {
  constructor(
    @Inject(DialogContentToken) readonly content: Portal<any>,
    @Inject(DialogStyleToken) readonly style: CSSStyleDeclaration | undefined,
  ) {}
}
