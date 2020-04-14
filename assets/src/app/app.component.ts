import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="top-toolbar">
      <preference></preference>
    </mat-toolbar>
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

      .top-toolbar {
        grid-area: header;
      }

      .editor {
        grid-area: editor;
      }
    `,
  ],
})
export class AppComponent {}
