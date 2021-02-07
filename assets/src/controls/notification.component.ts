import { Component, Input } from '@angular/core';
import { NotificationRef } from './notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <fluent-card class="container">
      <ng-template [cdkPortalOutlet]="portal"></ng-template>
    </fluent-card>
  `,
  styles: [
    `
      :host {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 10px;
      }

      :host:hover {
        background: #2a2d2e;
      }

      .container {
        display: flex;
        width: 100%;
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

  close() {
    this.notification?.close();
  }
}
