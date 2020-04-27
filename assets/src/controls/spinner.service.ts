import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Injectable()
export class SpinnerService {
  private spinning = 0;
  private readonly portal = new ComponentPortal(SpinnerComponent);
  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay) {}

  open() {
    this.spinning += 1;
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        }),
      );
      this.overlayRef.attach(this.portal);
      this.overlayRef.updatePosition();
    }
  }

  close() {
    this.spinning = Math.max(0, this.spinning - 1);
    if (this.spinning === 0) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
