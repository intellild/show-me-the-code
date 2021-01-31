import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ApplicationRef, Injectable, InjectionToken, Injector } from '@angular/core';
import { EventEmitter } from 'eventemitter3';
import { observable } from 'mobx-angular';
import { NotificationListComponent } from './notification-list.component';
import { TextOnlyNotificationComponent } from './text-only-notification.component';
import { mergeScan } from 'rxjs/operators';

export const NotificationContentMetaToken = new InjectionToken('NotificationContentMetaToken');

// export interface INotificationContent<T> {
//   meta: T | null;
//   componentRef:
// }

export class NotificationRef<T = unknown, M = unknown> extends EventEmitter<'accept' | 'reject' | 'clone'> {
  public readonly portal: ComponentPortal<T>;

  constructor(
    private readonly notificationService: NotificationService,
    parentInjector: Injector,
    component: ComponentType<T>,
    meta: M,
  ) {
    super();
    const injector = Injector.create({
      parent: parentInjector,
      providers: [
        {
          provide: NotificationRef,
          useValue: this,
        },
        {
          provide: NotificationContentMetaToken,
          useValue: meta,
        },
      ],
    });
    this.portal = new ComponentPortal(component, null, injector);
  }

  close() {}
}

@Injectable()
export class NotificationService {
  @observable
  list: NotificationRef[] = [];

  private readonly containerPortal = new ComponentPortal(NotificationListComponent);
  private overlayRef: OverlayRef | null = null;

  constructor(
    private readonly overlay: Overlay,
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector,
  ) {}

  public push(message: string): NotificationRef;
  public push<T, M>(component: ComponentType<T>, meta: M): NotificationRef;
  public push<T, M>(component: ComponentType<T> | string, meta?: M): NotificationRef {
    this.ensureContainer();
    let notification: NotificationRef;
    if (typeof component === 'string') {
      notification = new NotificationRef(this, this.injector, TextOnlyNotificationComponent, component);
    } else {
      notification = new NotificationRef(this, this.injector, component, meta);
    }
    this.list.unshift(notification);
    return notification;
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

  private pushMessage(message: string) {}
}
