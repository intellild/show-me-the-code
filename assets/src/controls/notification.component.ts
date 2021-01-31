import { Component, Input } from '@angular/core';
import { NotificationRef } from './notification.service';

@Component({
  selector: 'app-notification',
  template: ` <ng-template [cdkPortalOutlet]="portal"></ng-template> `,
  styles: [
    `
      :host {
        display: flex;
        padding: 10px 5px;
        box-sizing: border-box;
        color: rgb(204, 204, 204);
        background: rgb(37, 37, 38);
        width: 450px;
        box-shadow: rgb(0, 0, 0) 0 0 8px;
      }

      :host:hover {
        background: #2a2d2e;
      }
    `,
  ],
})
export class NotificationComponent {
  @Input()
  notification: NotificationRef | null = null;

  public get portal() {
    return this.notification?.portal;
  }
}
