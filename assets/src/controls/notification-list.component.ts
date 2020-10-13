import { Component } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-list',
  template: `
    <ng-container *mobxAutorun>
      <app-notification *ngFor="let it of list" [notification]="it"></app-notification>
    </ng-container>
  `,
  styles: [
    `
      :host {
        width: 450px;
        overflow: visible;
        transform: translateX(100%);
      }
    `,
  ],
})
export class NotificationListComponent {
  get list() {
    return this.notificationService.list;
  }

  constructor(private readonly notificationService: NotificationService) {}
}
