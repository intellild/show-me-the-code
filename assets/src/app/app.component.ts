import { ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { ISelectOption } from '../controls/select.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="toolbar">
      <preference></preference>

      <app-select *mobxAutorun [options]="options"></app-select>
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

  options: ISelectOption[] = [
    { value: 'typescript', text: 'TypeScript' },
    { value: 'javascript', text: 'JavaScript' },
    { value: 'rust', text: 'Rust' },
    { value: 'c', text: 'C' },
    { value: 'cpp', text: 'C++' },
    { value: 'csharp', text: 'C#' },
    { value: 'css', text: 'CSS' },
    { value: 'fsharp', text: 'F#' },
    { value: 'java', text: 'Java' },
    { value: 'json', text: 'JSON' },
    { value: 'less', text: 'Less' },
    { value: 'lua', text: 'Lua' },
    { value: 'objective-c', text: 'Objective C' },
    { value: 'plaintext', text: 'Plain Text' },
    { value: 'powershell', text: 'PowerShell' },
    { value: 'ruby', text: 'Ruby' },
    { value: 'scss', text: 'Scss' },
    { value: 'sql', text: 'SQL' },
    { value: 'swift', text: 'Swift' },
    { value: 'vb', text: 'Visual Basic' },
  ];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}
}
