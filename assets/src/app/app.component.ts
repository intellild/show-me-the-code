import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="toolbar">
      <preference></preference>

      <app-input *mobxAutorun></app-input>
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
  @HostBinding('class.monaco-workbench')
  workbench = true;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
  }
}
