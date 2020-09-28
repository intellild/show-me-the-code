import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { observe } from 'mobx';
import { computed, observable } from 'mobx-angular';
import { InputComponent } from './input.component';

export interface ISelectOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-select',
  template: `
    <app-input
      #input
      *mobxAutorun
      [placeholder]="text"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keydown)="onKeydown($event)"
      [(value)]="keyword"
    ></app-input>
    <ng-template #popup>
      <div *mobxAutorun class="options synthetic-focus" (mouseleave)="active = null">
        <div
          *ngFor="let option of items; let index = index; trackBy: optionsTrackBy"
          class="item"
          [class.active]="active !== null ? option.value === options[active].value : false"
          (mouseover)="active = index"
          (mousedown)="onItemClick($event, option)"
        >
          {{ option.text }}
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        position: relative;
        overflow: visible;
      }

      .options {
        width: 100%;
        box-sizing: border-box;
        background-color: rgb(60, 60, 60);
      }

      .item {
        height: 18px;
        display: flex;
        align-items: center;
        color: rgb(204, 204, 204);
        padding: 0 5px;
      }

      .item:hover,
      .item.active {
        background-color: #062f4a !important;
      }
    `,
  ],
})
export class SelectComponent implements AfterViewInit, OnDestroy {
  private overlayRef: OverlayRef | null = null;

  @ViewChild('input')
  inputRef: InputComponent | null = null;

  @observable
  active: number | null = null;

  @ViewChild('popup', { static: true })
  optionsTemplateRef: TemplateRef<any> | null = null;

  @Input()
  options: ISelectOption[] = [];

  @observable
  @Input()
  value = '';

  @Output()
  valueChange = new EventEmitter<string>();

  @observable
  keyword = '';

  @observable
  focused = false;

  @computed
  get text(): string {
    const value = this.value;
    const option = this.options.find((it) => it.value === value);
    return option?.text ?? '';
  }

  @computed
  get items(): ISelectOption[] {
    if (!this.keyword) {
      return this.options;
    }
    const search = this.keyword.toLowerCase();
    return this.options.filter((it) => it.text.includes(search) || it.value.includes(search));
  }

  private disposers: (() => void)[] = [];

  constructor(private readonly viewContainerRef: ViewContainerRef, private readonly overlay: Overlay) {
    this.disposers.push(
      observe(
        this,
        'value',
        () => {
          this.keyword = this.text;
        },
        false,
      ),
    );
  }

  optionsTrackBy(index: number, option: ISelectOption) {
    return option.value;
  }

  onFocus() {
    this.showOptions();
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.hideOptions();
  }

  showOptions() {
    if (this.overlayRef || !this.optionsTemplateRef) {
      return;
    }
    const portal = new TemplatePortal(this.optionsTemplateRef, this.viewContainerRef);
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        width: this.viewContainerRef.element.nativeElement.getBoundingClientRect().width,
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
    this.overlayRef.attach(portal);
    this.overlayRef.updatePosition();
  }

  hideOptions() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  onKeydown(e: KeyboardEvent) {
    if (!this.options.length) {
      this.active = null;
      return;
    }
    switch (e.key) {
      case 'ArrowUp':
        this.active = this.active === null ? this.options.length - 1 : this.active > 0 ? this.active - 1 : null;
        break;
      case 'ArrowDown':
        this.active = this.active === null ? 0 : (this.active + 1) % this.options.length;
        break;
    }
  }

  onItemClick(e: MouseEvent, option: ISelectOption) {
    e.preventDefault();
    this.valueChange.emit(option.value);
    this.inputRef?.blur();
  }

  ngAfterViewInit() {
    this.keyword = this.text;
    this.disposers.push(
      observe(this, 'value', () => {
        if (!this.focused) {
          this.keyword = this.text;
        }
      }),
      observe(this, 'focused', () => {
        if (this.focused) {
          this.keyword = '';
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.disposers.forEach((disposer) => disposer());
  }
}
