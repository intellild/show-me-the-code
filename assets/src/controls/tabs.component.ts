import { Component, EventEmitter, Input, Output } from '@angular/core';
import { observable } from 'mobx';

export interface ITab {
  key: string;
  text: string;
}

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <div
        *ngFor="let tab of tabs; trackBy: trackBy"
        class="tab"
        [class.active]="active === tab.key"
        (click)="onClick(tab)"
      >
        {{ tab.text }}
      </div>
    </div>
    <div class="content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .tabs {
        display: flex;
        flex-direction: row;
        height: 35px;
        background-color: #1e1e1e;
      }

      .tab {
        flex: 0 0 120px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        cursor: pointer;
        height: 35px;
        box-sizing: border-box;
        padding: 0 10px;
        background-color: rgb(45, 45, 45);
        color: rgba(255, 255, 255, 0.5);
      }

      .tab.active {
        background-color: rgb(30, 30, 30);
        color: rgb(255, 255, 255);
      }

      .content {
        background-color: rgb(30, 30, 30);
      }
    `,
  ],
})
export class TabsComponent {
  @observable
  @Input()
  tabs: ITab[] = [];

  @observable
  @Input()
  active: string | null = null;

  @Output()
  activeChange = new EventEmitter<string | null>();

  trackBy(index: number, tab: ITab) {
    return tab.key;
  }

  onClick(tab: ITab) {
    this.activeChange.emit(tab.key);
  }
}
