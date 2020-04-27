import { Component } from '@angular/core';
import { CodeService } from "../services/code.service";
import { EditorService } from '../services/editor.service';

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
export class AppComponent {
  get model() {
    return this.editorService.model;
  }

  constructor(private readonly editorService: EditorService, private readonly codeService: CodeService) {
  }
}
