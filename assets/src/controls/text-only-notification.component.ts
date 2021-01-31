import { Component, Inject } from '@angular/core';
import { NotificationContentMetaToken, NotificationRef } from './notification.service';

@Component({
  selector: 'app-text-only-notification',
  template: `
    <div class="container">
      <div class="content">

      </div>
      <div class="close">

      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
      }

      .content {
        flex: 1 1 100%;
      }

      .close {
        flex: 0 0 30px;
      }
    `
  ]
})
export class TextOnlyNotificationComponent {
  constructor(@Inject(NotificationContentMetaToken) public content: string, notificationRef: NotificationRef) {}
}
