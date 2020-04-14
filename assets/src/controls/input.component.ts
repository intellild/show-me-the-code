import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { observable } from 'mobx-angular';

@Component({
  selector: 'app-input',
  template: `
    <div class="wrapper">
      <input
        class="input"
        spellcheck="false"
        [placeholder]="placeholder"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
        [value]="value"
        (input)="onInput($event)"
      />
    </div>
  `,
  styles: [
    `
      :host {
        overflow: hidden;
        background-color: rgb(60, 60, 60);
        color: rgb(204, 204, 204);
      }

      .input {
        background-color: rgb(60, 60, 60);
        color: rgb(204, 204, 204);
        height: 24px;
      }

      :host.synthetic-focus {
        outline: rgba(14, 99, 156, 0.8) solid 1px;
        outline-offset: -1px;
      }
    `,
  ],
})
export class InputComponent {
  @Input()
  placeholder = '';

  @HostBinding('class.monaco-inputbox')
  inputBox = true;

  @HostBinding('class.idle')
  idle = true;

  @observable
  @HostBinding('class.synthetic-focus')
  focus = false;

  @Output('focus')
  focusEvent = new EventEmitter<FocusEvent>();

  @Output('blur')
  blurEvent = new EventEmitter<FocusEvent>();

  @Input()
  value = '';

  @Output()
  valueChange = new EventEmitter<string>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  onFocus(e: FocusEvent) {
    this.focus = true;
    this.focusEvent.emit(e);
  }

  onBlur(e: FocusEvent) {
    this.focus = false;
    this.blurEvent.emit(e);
  }

  onInput(e: Event) {
    this.valueChange.emit((e.currentTarget as HTMLInputElement).value);
  }
}
