import { Component, Input } from '@angular/core';
import { NotificationRef } from './notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="message">{{ message }}</div>
    <div *ngIf="accept && reject" class="action">
      <app-button>Accept</app-button>
      <app-button (click)="close()">Reject</app-button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: 10px 5px;
        box-sizing: border-box;
        color: rgb(204, 204, 204);
        background: rgb(37, 37, 38);
        width: 450px;
        box-shadow: rgb(0, 0, 0) 0 0 8px;
        margin-bottom: 10px;
      }

      :host:hover {
        background: #2a2d2e;
      }

      .message {
        margin-right: 10px;
      }

      .action {
        margin-top: 10px;
        display: flex;
        flex-direction: row-reverse;
      }
    `,
  ],
})
export class NotificationComponent {
  @Input()
  notification: NotificationRef | null = null;

  get message() {
    return this.notification?.text ?? '';
  }

  get accept() {
    return this.notification?.accept ?? false;
  }

  get reject() {
    return this.notification?.reject ?? false;
  }

  close() {
    this.notification?.close();
  }
}
