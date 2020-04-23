import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { observable } from 'mobx-angular';

@Component({
  selector: 'preference',
  template: `
    <div pop [popContent]="popContent" [(popOpen)]="popOpen" (click)="popOpen = true">
      <svg height="24" width="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M2 16v2h20v-2H2zm0-5v2h20v-2H2zm0-5v2h20V6H2z" />
      </svg>
    </div>
    <ng-template #popContent>
      <div class="container">
        <label>Language:</label>
        <app-input></app-input>
        <label>Language:</label>
        <app-input></app-input>
        <label>Language:</label>
        <app-input></app-input>
        <label>Language:</label>
        <app-input></app-input>
        <label>Language:</label>
        <app-input></app-input>
      </div>
    </ng-template>
  `,
  styles: [
    `
      button {
        padding: 0;
        min-width: 0;
      }

      .container {
        width: 500px;
        padding: 10px;
        display: grid;
        grid-template-columns: 100px auto;
        grid-auto-rows: minmax(40px, auto);
        align-items: center;
      }

      .container label {
        padding: 0 10px;
      }
    `,
  ],
  animations: [
    trigger('draw', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        }),
      ),
      state(
        'closing',
        style({
          transform: 'translateX(-100%)',
        }),
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-100%)',
        }),
      ),
      transition('open => close', [animate('0.3s')]),
      transition('close => open', [animate('0.3s')]),
    ]),
  ],
})
export class PreferenceComponent {
  @observable
  popOpen = false;
}
