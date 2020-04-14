import { FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { PreferencePopupComponent } from './preference-popup.component';

@Component({
  selector: 'preference',
  template: `
    <button #anchor color="accent" mat-stroked-button mat-flat-button (click)="showPopup()">
      <svg height="24" width="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M2 16v2h20v-2H2zm0-5v2h20v-2H2zm0-5v2h20V6H2z" />
      </svg>
    </button>
  `,
  styles: [
    `
      button {
        padding: 0;
        min-width: 0;
      }

      :host ::ng-deep .mat-button-wrapper {
        display: flex;
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class PreferenceComponent {
  private readonly portal = new ComponentPortal(PreferencePopupComponent);
  private overlayRef: OverlayRef | null = null;
  @ViewChild('anchor', { static: true, read: ElementRef })
  buttonRef: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly overlay: Overlay) {}

  showPopup() {
    if (this.overlayRef) {
      return;
    }
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: 'transparent',
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.buttonRef)
          .withPositions([
            {
              offsetY: 10,
              overlayX: 'start',
              overlayY: 'top',
              originX: 'start',
              originY: 'bottom',
            },
          ]),
      }),

    );
    this.overlayRef.attach(this.portal);
    this.overlayRef.updatePosition();
    const $ = this.overlayRef.backdropClick().subscribe(() => {
      $.unsubscribe();
      this.hidePopup();
    });
    this.changeDetectorRef.detectChanges();
  }

  hidePopup() {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
  }
}
