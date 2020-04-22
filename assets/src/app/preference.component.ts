import { animate, state, style, transition, trigger } from '@angular/animations';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { observable } from 'mobx-angular';

@Component({
  selector: 'preference',
  template: `
    <div (click)="showPopup()">
      <svg height="24" width="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M2 16v2h20v-2H2zm0-5v2h20v-2H2zm0-5v2h20V6H2z" />
      </svg>
    </div>
    <ng-template #templateRef>
      <div [@draw]="state" [@draw.done]="animationFinished()" class="container">hello</div>
    </ng-template>
  `,
  styles: [
    `
      button {
        padding: 0;
        min-width: 0;
      }

      .container {
        width: 500px;
        height: 100%;
        background: red;
      }
    `,
  ],
  animations: [
    trigger('draw', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        }),
      ),
      state(
        'closing',
        style({
          transform: 'translateX(-100%)',
        }),
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-100%)',
        }),
      ),
      transition('open => close', [animate('0.3s')]),
      transition('close => open', [animate('0.3s')]),
    ]),
  ],
})
export class PreferenceComponent {
  private overlayRef: OverlayRef | null = null;

  @ViewChild('templateRef', { static: true })
  templateRef: TemplateRef<any>;

  @observable
  state: 'open' | 'closing' | 'closed' = 'closed';

  constructor(private readonly viewContainerRef: ViewContainerRef, private readonly overlay: Overlay) {}

  showPopup() {
    if (this.overlayRef) {
      return;
    }
    const portal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      height: '100%',
      positionStrategy: this.overlay.position().global().bottom('0').left('0').top('0'),
    });
    const $ = this.overlayRef.backdropClick().subscribe(() => {
      $.unsubscribe();
      this.hidePopup();
    });
    this.overlayRef.attach(portal);
    this.overlayRef.updatePosition();
    this.state = 'open';
  }

  hidePopup() {
    this.state = 'closing';
  }

  animationFinished() {
    if (this.state === 'open' || !this.overlayRef) {
      return;
    }
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
  }
}
