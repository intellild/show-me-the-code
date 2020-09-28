import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="checkbox">
      {{ value ? '✓' : ' ' }}
    </div>
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        height: 30px;
        cursor: pointer;
        color: rgb(243, 242, 241);
      }

      :host:hover {
        color: rgb(243, 242, 241);
      }

      .checkbox {
        color: #f0f0f0;
        background-color: #3c3c3c;
        height: 18px;
        width: 18px;
        border: 1px solid #3c3c3c;
        border-radius: 3px;
        margin: 3px 9px 0 0;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class CheckboxComponent {
  @Input()
  value = false;

  @Output()
  valueChange = new EventEmitter();

  @HostListener('click')
  onClick() {
    this.valueChange.emit(!this.value);
  }
}
