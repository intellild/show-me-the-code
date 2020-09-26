import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from '../controls/dialog.service';
import { SpinnerService } from '../controls/spinner.service';
import { ConnectionService, ConnectState } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { UserService } from '../services/user.service';
import { ShelfComponent } from "./shelf.component";

@Component({
  selector: 'app-root',
  template: `
    <div *mobxAutorun class="toolbar">
      <preference></preference>
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

  get model() {
    return this.editorService.model;
  }

  constructor(
    private readonly userService: UserService,
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
            this.dialogService.open(ShelfComponent);
            break;
          default:
            break;
        }
      }),
    );
    const user = await this.userService.getUser();
    this.connectionService.connect(user);
  }

  ngOnDestroy() {
    this.$$.forEach((it) => it.unsubscribe());
  }
}
