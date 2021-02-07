import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { computed, observable } from 'mobx-angular';
import { NotificationContentMetaToken } from '../controls/notification.service';

export interface IJoinRequest {
  userLogin: string;
}

@Component({
  selector: 'app-join-request-notification',
  template: `
    <div *mobxAutorun class="avatar" [style.background-image]="backgroundImage"></div>
    <div *mobxAutorun class="content">
      <fluent-anchor appearance="hypertext" href="#">AAA</fluent-anchor>
      wants to join
    </div>
    <fluent-button *mobxAutorun class="reject">Reject</fluent-button>
    <fluent-button appearance="accent" class="accept">Accept</fluent-button>
  `,
  styleUrls: ['./join-request-notification.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class JoinRequestNotificationComponent {
  @observable
  avatar = '';

  @computed
  get backgroundImage() {
    return `url(${this.avatar})`;
  }

  constructor(@Inject(NotificationContentMetaToken) public content: IJoinRequest) {}
}
