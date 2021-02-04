import { Component, EventEmitter, Input, Output } from '@angular/core';
import { observable } from 'mobx-angular';
import * as monaco from 'monaco-editor';
import { EditorService } from '../services/editor.service';

console.log(monaco.languages.getLanguages());

@Component({
  selector: 'app-language-select',
  template: `<app-select label="Language:" [options]="options" [value]="value" (valueChange)="valueChange.emit($event)"></app-select>`,
})
export class LanguageSelectComponent {
  get options() {
    return this.editorService.languageOptions;
  }

  @Input()
  @observable
  value = '';

  @Output()
  readonly valueChange = new EventEmitter<string>();

  constructor(readonly editorService: EditorService) {}
}
