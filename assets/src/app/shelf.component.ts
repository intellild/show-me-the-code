import { AfterViewInit, ApplicationRef, Component, ViewEncapsulation } from '@angular/core';
import { computed, observable } from 'mobx-angular';
import * as monaco from 'monaco-editor';
import { NotificationService } from '../controls/notification.service';
import { ISelectOption } from '../controls/select.component';
import { SpinnerService } from '../controls/spinner.service';
import { IGist, IGistFile } from '../models';
import { CollaborationService } from '../services/collaboration.service';
import { ConnectionService, JoinState } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { GithubService } from '../services/github.service';
import { IJoinRequest, JoinRequestNotificationComponent } from './join-request-notification.component';

function getExtension(filename: string | null | undefined): string {
  if (!filename) {
    return '';
  }
  const dot = filename.lastIndexOf('.');
  if (dot === -1) {
    return '';
  }
  return filename.substring(dot);
}

function omitExtension(filename: string | null | undefined): string {
  if (!filename) {
    return '';
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
  gistCount = 0;

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
    private readonly githubService: GithubService,
    private readonly spinnerService: SpinnerService,
    private readonly connectionService: ConnectionService,
    private readonly editorService: EditorService,
    private readonly collaborationService: CollaborationService,
    private readonly notificationService: NotificationService,
  ) {}

  ngAfterViewInit() {
    this.loadGists();
  }

  onIsCurrentGistChange(e: InputEvent) {
    this.targetCurrentGist = (e.target as HTMLInputElement).checked;
  }

  async loadGists() {
    this.spinnerService.open();
    const { nodes, totalCount } = await this.githubService.getGists(10);
    this.list = (nodes ?? []) as IGist[];
    this.gistCount = totalCount;
    this.spinnerService.close();
  }

  onGistClick(gist: IGist) {
    if (this.targetCurrentGist) {
      this.targetGistId = gist.id;
    }
    this.currentGist = gist;
  }

  onFileClick(file: IGistFile) {
    if (file.name) {
      if (!this.alias || this.alias === omitExtension(this.currentFile?.name)) {
        this.alias = omitExtension(file.name);
      }
      if (!this.filename || this.filename === this.currentFile?.name) {
        this.filename = file.name;
      }
      this.language = this.editorService.getFileType(file.name) ?? 'plaintext';
    }
    this.currentFile = file;
  }

  getGistName(gist: IGist) {
    return gist.files?.[0]?.name ?? gist.name;
  }

  async openEmpty() {
    if (!this.alias || !this.currentGist?.id) {
      return;
    }
    try {
      this.spinnerService.open();
      await this.connectionService.open(this.alias);
      this.collaborationService.room = {
        filename: this.filename,
        gistId: this.currentGist?.id,
        alias: this.alias,
      };
      this.editorService.language$.next(this.language);
    } catch (e) {
      console.error(e.message);
    } finally {
      this.spinnerService.close();
    }
  }

  async open() {
    this.notificationService.push<JoinRequestNotificationComponent, IJoinRequest>(JoinRequestNotificationComponent, {
      userLogin: 'intellild'
    });
  }

  async join() {
    try {
      const state$ = this.connectionService.requestJoin(this.alias);
      const subscription = state$.subscribe(
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
          subscription.unsubscribe();
        },
        (error) => {
          this.spinnerService.close();
          console.error(error);
          subscription.unsubscribe();
        },
      );
    } catch (e) {
      console.error(e);
      this.spinnerService.close();
    }
  }

  onAliasChange(value: string) {
    const prevAlias = this.alias;
    const prevFileName = omitExtension(this.filename);
    this.alias = value;
    if (prevAlias !== prevFileName) {
      return;
    }
    let extension = getExtension(this.filename);
    if (!extension) {
      const language = monaco.languages.getLanguages().find((it) => it.id === this.language);
      if (language?.extensions?.length) {
        extension = language.extensions[0];
      }
    }
    this.filename = `${value}${extension}`;
  }
}
