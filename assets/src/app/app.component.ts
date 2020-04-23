import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div *mobxAutorun class="toolbar">
      <preference></preference>
    </div>
    <div class="editor" monaco-editor></div>
  `,
  styles: [
    `
      :host {
        overflow: hidden;
        display: grid;
        grid-template:
          'header header' 60px
          'editor output' minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr) 38.2%;
      }

      .toolbar {
        grid-area: header;
        background: #212121;
        color: #fff;
        display: flex;
        align-items: center;
      }

      .editor {
        grid-area: editor;
      }
    `,
  ],
})
export class AppComponent {

}
