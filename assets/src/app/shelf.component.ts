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
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
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

  @observable
  targetCurrentGist = true;

  @computed
  get targetGistList(): ISelectOption[] {
    return this.list.map((it) => {
      const displayName = it.name ?? it.id;
      return {
        value: it.id,
        text: it.id === this.currentGist?.id ? `[Current Gist] ${displayName}` : displayName,
      };
    });
  }

  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly dialogRef: DialogRef<ShelfComponent>,
    private readonly githubService: GithubService,
    private readonly spinnerService: SpinnerService,
  ) {}

  async ngAfterViewInit() {
    // this.spinnerService.open();
    // this.list = await this.githubService.getGists(0);
    // this.spinnerService.close();
  }

  onGistClick(gist: IGist) {
    if (this.targetCurrentGist) {
      this.targetGistId = gist.id;
    }
    this.currentGist = gist;
  }
}
