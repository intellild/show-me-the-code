import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpinnerComponent, SpinnerTextToken } from './spinner.component';

@Injectable()
export class SpinnerService {
  private readonly portal: ComponentPortal<SpinnerComponent>;
  private overlayRef: OverlayRef | null = null;
  private readonly injector: Injector;
  private readonly text$ = new BehaviorSubject('');

  constructor(private readonly overlay: Overlay, injector: Injector) {
    this.injector = Injector.create({
      providers: [
        {
          provide: SpinnerTextToken,
          useValue: this.text$,
        },
      ],
      parent: injector,
    });
    this.portal = new ComponentPortal(SpinnerComponent, null, this.injector);
  }

  open(text = '') {
    this.text$.next(text);
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
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
