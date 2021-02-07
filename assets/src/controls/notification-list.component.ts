import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { animate, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification-list',
  template: `
    <ng-container *mobxAutorun>
      <app-notification @listItemTrigger *ngFor="let it of list" [notification]="it"></app-notification>
    </ng-container>
  `,
  styles: [
    `
      :host {
        width: 350px;
        overflow: visible;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  animations: [
    trigger('listItemTrigger', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('200ms 100ms ease-out')]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
        animate('100ms 150ms ease-in', style({ height: '0' })),
      ]),
    ]),
  ],
})
export class NotificationListComponent {
  get list() {
    return this.notificationService.list;
  }

  constructor(private readonly notificationService: NotificationService) {}
}
