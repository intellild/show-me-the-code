import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ApplicationRef, Injectable } from '@angular/core';
import { observable } from 'mobx-angular';
import { SpinnerComponent } from './spinner.component';

@Injectable()
export class SpinnerService {
  private readonly portal = new ComponentPortal(SpinnerComponent);
  private overlayRef: OverlayRef | null = null;

  @observable
  text = '';

  constructor(private readonly overlay: Overlay, private readonly applicationRef: ApplicationRef) {}

  open(text = '') {
    this.text = text;
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        }),
      );
      this.overlayRef.attach(this.portal);
      requestAnimationFrame(() => this.applicationRef.tick());
      this.overlayRef.updatePosition();
    }
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.text = '';
    }
  }
}
