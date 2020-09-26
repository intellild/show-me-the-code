import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { CodeService } from '../services/code.service';
import { ConnectionService } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { DialogService } from '../controls/dialog.service';
import { IReactionDisposer, observe } from 'mobx';
import { UserService } from "../services/user.service";
import { ShelfComponent } from './shelf.component';
import { Subscription } from 'rxjs';

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
  ) {}

  async ngAfterViewInit(): Promise<void> {
    // const user = await this.userService.getUser();
    // console.log(user);
    // this.$$.push(
    //   this.connectionService.connected$.pipe(distinctUntilChanged()).subscribe((connected) => {
    //     if (connected) {
    //       this.dialogService.open(ShelfComponent);
    //     }
    //   }),
    // );
    // this.connectionService.connect();
  }

  ngOnDestroy() {
    this.$$.forEach((it) => it.unsubscribe());
  }
}
