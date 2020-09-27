import { AfterViewInit, ApplicationRef, Component } from '@angular/core';
import { observable } from 'mobx';
import { computed } from 'mobx-angular';
import { DialogRef } from '../controls/dialog.service';
import { ISelectOption } from '../controls/select.component';
import { SpinnerService } from '../controls/spinner.service';
import { ITab } from '../controls/tabs.component';
import { IGist, IGistFile } from '../models';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-shelf',
  template: `
    <div *mobxAutorun class="list synthetic-focus">
      <div
        *ngFor="let item of list"
        class="item"
        [class.active]="item.id === currentGist?.id"
        (click)="onGistClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div *mobxAutorun class="list synthetic-focus">
      <ng-container *ngIf="currentGist !== null">
        <div *ngFor="let file of currentGist.files" class="item" [class.active]="file === currentFile">
          {{ file.filename }}
        </div>
      </ng-container>
    </div>
    <div *mobxAutorun class="actions">
      <div>
        <app-button>Create Empty</app-button>
      </div>
      <div>
        <app-button>Open Selected File</app-button>
      </div>
      <div>
        <app-button>Fork</app-button>
        <div>
          <label>Target Gist:</label>
          <app-select *mobxAutorun [options]="targetGistList" [(value)]="targetGistId"></app-select>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: 600px;
        flex-direction: row;
        padding: 20px;
      }

      .list {
        overflow-x: hidden;
        overflow-y: auto;
        flex: 0 0 200px;
        height: 100%;
        background-color: rgb(27, 26, 25);
        color: rgb(243, 242, 241);
      }

      .item {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 10px;
      }

      .item.active,
      .item:hover {
        cursor: pointer;
        background: rgb(37, 36, 35);
        color: rgb(243, 242, 241);
      }

      .actions {
        flex: 0 0 400px;
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

  @observable
  currentGist: IGist | null = null;

  @observable
  currentFile: IGistFile | null = null;

  @observable
  targetGistId: string | null = null;

  @computed
  get targetGistList(): ISelectOption[] {
    return this.list.map((it) => ({
      value: it.id,
      text: it.id === this.currentGist?.id ? `[Current Gist] ${it.name}` : it.name,
    }));
  }

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

  onGistClick(gist: IGist) {
    if (!this.targetGistId || this.currentGist?.id === this.targetGistId) {
      this.targetGistId = gist.id;
    }
    this.currentGist = gist;
  }
}
