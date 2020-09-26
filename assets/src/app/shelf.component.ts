import { AfterViewInit, ApplicationRef, Component } from '@angular/core';
import { observable } from 'mobx';
import { DialogRef } from '../controls/dialog.service';
import { SpinnerService } from '../controls/spinner.service';
import { ITab } from '../controls/tabs.component';
import { IGist } from '../models';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-shelf',
  template: `
    <ng-container *mobxAutorun>
      <app-tabs [tabs]="tabs" [(active)]="active" [ngSwitch]="active">
        <div *ngSwitchCase="'exist'" class="container">
          <div class="gist-list">
            <ng-container *ngFor="let item of list">
              <div class="gist" *mobxAutorun>
                {{ item.name }}
              </div>
            </ng-container>
          </div>
        </div>
        <div *ngSwitchCase="'new'">
          <input />
          <input />
          <input />
        </div>
      </app-tabs>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 600px;
      }

      .container {
        height: 40vh;
        display: grid;
        grid-template:
          'left right' 1fr
          'bottom bottom' 30px;
      }

      .gist-list {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .gist {
        height: 48px;
      }
    `,
  ],
})
export class ShelfComponent implements AfterViewInit {
  readonly tabs: ITab[] = [
    {
      key: 'exist',
      text: 'Exist',
    },
    {
      key: 'new',
      text: 'New',
    },
  ];

  @observable
  active = 'exist';

  @observable
  list: IGist[] = [];

  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly dialogRef: DialogRef<ShelfComponent>,
    private readonly githubService: GithubService,
    private readonly spinnerService: SpinnerService,
  ) {}

  async ngAfterViewInit() {
    this.spinnerService.open();
    this.list = await this.githubService.getGists(0);
    this.spinnerService.close();
  }
}
