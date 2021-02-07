import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { NotificationContentMetaToken, NotificationRef } from './notification.service';

@Component({
  selector: 'app-text-only-notification',
  template: `
    <div>

    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TextOnlyNotificationComponent {
  constructor(@Inject(NotificationContentMetaToken) public content: string, notificationRef: NotificationRef) {}
}
