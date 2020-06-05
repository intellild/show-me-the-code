import { Component } from '@angular/core';
import { observable } from "mobx";
import { DialogRef } from '../controls/dialog.service';
import { ITab } from "../controls/tabs.component";

@Component({
  selector: 'app-shelf',
  template: `
    <ng-container *mobxAutorun>
      <app-tabs [tabs]="tabs" [(active)]="active"></app-tabs>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 600px;
      }
    `,
  ],
})
export class ShelfComponent {
  readonly tabs: ITab[] = [
    {
      key: 'hello',
      text: '123'
    },
    {
      key: 'world',
      text: '456'
    }
  ];

  @observable
  active = 'hello';

  constructor(private readonly dialogRef: DialogRef<ShelfComponent>) {}
}
