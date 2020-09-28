import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `
    <div class="wrapper">
      <input
        #input
        class="input"
        spellcheck="false"
        [placeholder]="placeholder"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
        [value]="value"
        (input)="onInput($event)"
      />
      <ng-container *ngIf="icon" [ngTemplateOutlet]="icon"></ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        overflow: hidden;
        background-color: rgb(60, 60, 60);
        color: rgb(204, 204, 204);
      }

      .wrapper {
        display: flex;
        align-items: center;
      }

      .input {
        background-color: rgb(60, 60, 60);
        color: rgb(204, 204, 204);
        height: 24px;
      }
    `,
  ],
})
export class InputComponent {
  @ViewChild('input', { static: true, read: ElementRef })
  inputRef: ElementRef<HTMLInputElement> | null = null;

  @Input()
  placeholder = '';

  @HostBinding('class.monaco-inputbox')
  inputBox = true;

  @HostBinding('class.idle')
  idle = true;

  @HostBinding('class.synthetic-focus')
  focused = false;

  @Output('focus')
  focusEvent = new EventEmitter<FocusEvent>();

  @Output('blur')
  blurEvent = new EventEmitter<FocusEvent>();

  @Input()
  value = '';

  @Output()
  valueChange = new EventEmitter<string>();

  @Input()
  icon: TemplateRef<any> | null = null;

  onFocus(e: FocusEvent) {
    this.focused = true;
    this.focusEvent.emit(e);
  }

  onBlur(e: FocusEvent) {
    this.focused = false;
    this.blurEvent.emit(e);
  }

  onInput(e: Event) {
    this.valueChange.emit((e.currentTarget as HTMLInputElement).value);
  }

  focus() {
    this.inputRef?.nativeElement?.focus();
  }

  blur() {
    this.inputRef?.nativeElement?.blur();
  }
}
