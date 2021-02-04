import { AfterViewInit, ApplicationRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { computed, observable } from 'mobx-angular';
import { DialogRef } from '../controls/dialog.service';
import { ISelectOption } from '../controls/select.component';
import { SpinnerService } from '../controls/spinner.service';
import { IGist, IGistFile } from '../models';
import { ConnectionService, JoinState } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { GithubService } from '../services/github.service';

function omitExtension(filename: string | undefined): string {
  if (!filename) {
    return "";
  }
  const dot = filename.lastIndexOf('.');
  if (dot === -1) {
    return filename;
  }
  return filename.substring(0, dot);
}

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShelfComponent implements AfterViewInit {
  static dialogStyle = {
    '--dialog-width': '800px',
  };

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

  @observable
  alias = '';

  @observable
  language = this.editorService.language$.getValue();

  @observable
  filename = '';

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
    private readonly connectionService: ConnectionService,
    private readonly editorService: EditorService,
  ) {}

  ngAfterViewInit() {
    this.loadGists();
  }

  onIsCurrentGistChange(e: InputEvent) {
    this.targetCurrentGist = (e.target as HTMLInputElement).checked;
  }

  async loadGists() {
    this.spinnerService.open();
    this.list = await this.githubService.getGists(0);
    this.spinnerService.close();
  }

  onGistClick(gist: IGist) {
    if (this.targetCurrentGist) {
      this.targetGistId = gist.id;
    }
    this.currentGist = gist;
  }

  onFileClick(file: IGistFile) {

    if (file.filename) {
      if (!this.alias || this.alias === omitExtension(this.currentFile?.filename)) {
        this.alias = omitExtension(file.filename);
      }
      if (!this.filename || this.filename === this.currentFile?.filename) {
        this.filename = file.filename;
      }
      this.language = this.editorService.getFileType(file.filename) ?? 'plaintext';
    }
    this.currentFile = file;
  }

  async open() {
    if (!this.alias) {
      return;
    }
    try {
      this.spinnerService.open();
      await this.connectionService.open(this.alias);
    } catch (e) {
      console.error(e.message);
    } finally {
      this.spinnerService.close();
    }
  }

  async join() {
    try {
      const state$ = this.connectionService.requestJoin(this.alias);
      state$.subscribe(
        (state) => {
          switch (state) {
            case JoinState.Connecting:
              this.spinnerService.open('Connecting');
              break;
            case JoinState.WaitingForAccept:
              this.spinnerService.open('Waiting For Accept');
              break;
            case JoinState.Accepted:
              this.spinnerService.close();
              break;
          }
        },
        (error) => {
          this.spinnerService.close();
          console.error(error);
        },
      );
    } catch (e) {
      console.error(e);
      this.spinnerService.close();
    }
  }
}
