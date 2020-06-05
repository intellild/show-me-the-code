import { AfterViewInit, Component, Inject, InjectionToken } from '@angular/core';
import { Portal } from '@angular/cdk/portal';

export const DialogContentToken = new InjectionToken('DIALOG_CONTENT');

@Component({
  selector: 'app-dialog',
  template: `
    <div>
      <ng-template [cdkPortalOutlet]="content"></ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: #2b2b2b;
        box-shadow: rgba(0, 0, 0, 0.19) 0 0 8px;
        color: #eeffff;
        padding: 20px;
      }
    `,
  ],
})
export class DialogComponent implements AfterViewInit {
  constructor(@Inject(DialogContentToken) readonly content: Portal<any>) {}

  ngAfterViewInit() {
    console.log("After view init")
  }
}
