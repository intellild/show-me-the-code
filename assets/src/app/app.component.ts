import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { observable } from 'mobx-angular';
import { Subscription } from 'rxjs';
import { DialogRef, DialogService } from '../controls/dialog.service';
import { EditorDirective } from '../controls/editor.directive';
import { SpinnerService } from '../controls/spinner.service';
import { IUser } from '../models';
import { ConnectionService, ConnectState } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { GithubService } from '../services/github.service';
import { ShelfComponent } from './shelf.component';

@Component({
  selector: 'app-root',
  template: `
    <div *mobxAutorun class="toolbar">
      <app-preference></app-preference>
      <app-persona [user]="user"></app-persona>
    </div>
    <monaco-editor [model]="model"></monaco-editor>
    <app-terminal></app-terminal>
  `,
  styles: [
    `
      :host {
        overflow: hidden;
        display: grid;
        grid-template: 'header header' 60px 'editor output' minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr) 38.2%;
      }

      .toolbar {
        grid-area: header;
        background: #212121;
        color: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px;
      }

      monaco-editor {
        grid-area: editor;
      }

      app-terminal {
        grid-area: output;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly $$: Subscription[] = [];
  private shelfDialog: DialogRef<ShelfComponent> | null = null;
  @ViewChild(EditorDirective)
  editor: EditorDirective | null = null;

  @observable
  user: IUser | null = null;

  get model() {
    return this.editorService.model;
  }

  constructor(
    private readonly userService: GithubService,
    private readonly editorService: EditorService,
    private readonly connectionService: ConnectionService,
    private readonly dialogService: DialogService,
    private readonly spinnerService: SpinnerService,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.$$.push(
      this.connectionService.connectState$.subscribe((state) => {
        switch (state) {
          case ConnectState.Connecting:
            this.spinnerService.open();
            break;
          case ConnectState.LoginSuccess:
            this.spinnerService.close();
            this.shelfDialog = this.dialogService.open(ShelfComponent, ShelfComponent.dialogStyle);
            break;
          case ConnectState.JoinSuccess:
            this.shelfDialog?.close();
            this.shelfDialog = null;
            break;
          default:
            break;
        }
      }),
      this.editorService.fontSize$.subscribe((fontSize) => {
        this.editor?.instance?.updateOptions({
          fontSize,
        });
      }),
    );
    this.user = await this.userService.getUser();
    this.connectionService.connect(this.user);
  }

  ngOnDestroy() {
    this.$$.forEach((it) => it.unsubscribe());
  }
}
