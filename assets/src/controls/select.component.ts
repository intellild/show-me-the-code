import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component, ElementRef,
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

export interface ISelectOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-select',
  template: `
    <fluent-text-field
      #input
      *mobxAutorun
      class="input"
      [placeholder]="text"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keydown)="onKeydown($event)"
      [value]="keyword"
      (input)="keyword = $event.target.value"
    >
      {{label}}
    </fluent-text-field>
    <ng-template #popup>
      <fluent-listbox *ngIf="items.length > 0" class="options">
        <fluent-option
          class="item"
          *ngFor="let option of items; let index = index; trackBy: optionsTrackBy"
          [selected]="value === option.value"
          (mousedown)="onItemSelect($event, option)"
        >
          {{ option.text }}
        </fluent-option>
      </fluent-listbox>
    </ng-template>
  `,
  styles: [
    `
      :host {
        position: relative;
        overflow: visible;
      }

      .input {
        width: 100%;
      }

      .options {
        width: 100%;
        box-sizing: border-box;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .item {
        flex: 0 0 auto;
      }
    `,
  ],
})
export class SelectComponent implements AfterViewInit, OnDestroy {
  private overlayRef: OverlayRef | null = null;

  @ViewChild('input')
  inputRef = new ElementRef<HTMLInputElement | null>(null);

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

  @observable
  @Input()
  label = '';

  @computed
  get text(): string {
    if (this.focused) {
      return this.keyword;
    }
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

  private $$: (() => void)[] = [];

  constructor(private readonly viewContainerRef: ViewContainerRef, private readonly overlay: Overlay) {
    this.$$.push(
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
    this.hideOptions();
    this.focused = false;
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.value = this.text;
    }
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

  onItemSelect(e: MouseEvent, option: ISelectOption) {
    e.stopPropagation();
    e.preventDefault();
    this.valueChange.emit(option.value);
    this.inputRef.nativeElement?.blur();
  }

  ngAfterViewInit() {
    this.keyword = this.text;
    this.$$.push(
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
    this.$$.forEach((disposer) => disposer());
  }
}
