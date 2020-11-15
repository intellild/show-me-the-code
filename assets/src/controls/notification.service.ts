import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ApplicationRef, Injectable } from '@angular/core';
import { EventEmitter } from 'eventemitter3';
import { observable } from 'mobx-angular';
import { NotificationListComponent } from './notification-list.component';

export interface INotificationOptions {
  text: string;
  accept?: boolean;
  reject?: boolean;
}

export class NotificationRef extends EventEmitter<'accept' | 'reject' | 'clone'> {
  @observable
  text = '';

  @observable
  accept = false;

  @observable
  reject = false;

  constructor(private readonly notificationService: NotificationService, options: INotificationOptions) {
    super();
    const { text = '', accept = false, reject = false } = options;
    this.text = text;
    this.accept = accept;
    this.reject = reject;
  }

  close() {
    this.notificationService.remove(this);
  }
}

@Injectable()
export class NotificationService {
  @observable
  list: NotificationRef[] = [];

  private readonly containerPortal = new ComponentPortal(NotificationListComponent);
  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay, private readonly applicationRef: ApplicationRef) {}

  push(options: INotificationOptions) {
    this.ensureContainer();
    const notification = new NotificationRef(this, options);
    this.list.unshift(notification);
    return notification;
  }

  remove(ref: NotificationRef) {
    const index = this.list.indexOf(ref);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }

  private ensureContainer() {
    if (this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: false,
        panelClass: '',
        positionStrategy: this.overlay.position().global().right('0').bottom('0'),
      }),
    );
    this.overlayRef.attach(this.containerPortal);
    requestAnimationFrame(() => this.applicationRef.tick());
    this.overlayRef.updatePosition();
  }
}
