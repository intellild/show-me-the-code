import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { observable } from 'mobx-angular';

@Component({
  selector: 'app-drawer',
  template: `
    <div *mobxAutorun class="container">
      <ng-template [cdkPortalOutlet]="contentPortal"></ng-template>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100%;
      }
    `,
  ],
})
export class DrawerComponent {
  @observable
  contentPortal: Portal<any> | null = null;
}
