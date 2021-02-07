import { Component, Input } from '@angular/core';
import { computed, observable } from 'mobx-angular';
import { IUser } from '../models';

@Component({
  selector: 'app-persona',
  template: ` <div *mobxAutorun class="avatar" [style.background-image]="backgroundImage"></div> `,
  styles: [
    `
      :host {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: block;
        margin-left: auto;
        overflow: hidden;
      }

      .avatar {
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class PersonaComponent {
  @Input()
  @observable
  user: IUser | null = null;

  @computed
  get backgroundImage() {
    const url = this.user?.avatarUrl ?? '';
    return `url(${url})`;
  }
}
