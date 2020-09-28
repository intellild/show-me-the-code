import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogComponent, DialogContentToken } from './dialog.component';

export class DialogRef<T> {
  private readonly dialogPortal: ComponentPortal<DialogComponent>;

  constructor(
    private readonly overlayRef: OverlayRef,
    component: ComponentType<T>,
    serviceInjector: Injector,
    parentInjector?: Injector | undefined,
  ) {
    const injector = Injector.create({
      providers: [
        {
          provide: DialogRef,
          useValue: this,
        },
      ],
      parent: parentInjector,
    });
    const contentPortal = new ComponentPortal<T>(component, null, injector);
    const dialogInjector = Injector.create({
      providers: [
        {
          provide: DialogContentToken,
          useValue: contentPortal,
        },
      ],
      parent: serviceInjector,
    });
    this.dialogPortal = new ComponentPortal<DialogComponent>(DialogComponent, null, dialogInjector);
  }

  open() {
    this.overlayRef.attach(this.dialogPortal);
  }

  close() {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  updatePosition() {
    this.overlayRef.updatePosition();
  }
}

@Injectable()
export class DialogService {
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
  ) {}

  open<T>(component: ComponentType<T>, injector?: Injector | undefined) {
    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      }),
    );
    const dialog = new DialogRef(overlayRef, component, this.injector, injector);
    dialog.open();
    requestAnimationFrame(() => this.applicationRef.tick());
    dialog.updatePosition();
    return dialog;
  }
}
