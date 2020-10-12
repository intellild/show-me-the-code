import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { observe } from 'mobx';
import { observable } from 'mobx-angular';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[pop]',
})
export class PopDirective implements AfterViewInit, OnDestroy {
  @Input()
  popContent: TemplateRef<any> | null = null;

  @observable
  @Input()
  popOpen = false;

  @Output()
  popOpenChange = new EventEmitter<boolean>();

  private overlayRef: OverlayRef | null = null;
  private disposers: (() => void)[] = [];
  private $: Subscription | null = null;

  constructor(private readonly viewContainerRef: ViewContainerRef, private readonly overlay: Overlay) {}

  ngAfterViewInit(): void {
    this.disposers.push(
      observe(this, 'popOpen', () => {
        if (this.popOpen) {
          this.open();
        } else {
          this.close();
        }
      }),
    );
  }

  private open() {
    if (!this.popContent || this.overlayRef) {
      return;
    }
    const portal = new TemplatePortal(this.popContent, this.viewContainerRef);
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: '',
        panelClass: 'pop',
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.viewContainerRef.element)
          .withPositions([
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
            },
          ]),
      }),
    );
    this.$ = this.overlayRef.backdropClick().subscribe(() => {
      this.popOpenChange.emit(false);
    });
    this.overlayRef.attach(portal);
    this.overlayRef.updatePosition();
  }

  private close() {
    if (!this.overlayRef) {
      return;
    }
    this.$?.unsubscribe();
    this.$ = null;
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.close();
    this.disposers.forEach((disposer) => disposer());
  }
}
