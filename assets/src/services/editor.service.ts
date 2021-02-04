import { Injectable, OnDestroy } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ISelectOption } from '../controls/select.component';

const THEME_KEY = 'THEME';

@Injectable()
export class EditorService implements OnDestroy {
  readonly languageOptions: ISelectOption[];
  readonly extensions: Map<string, string>;
  readonly language$ = new BehaviorSubject('javascript');
  readonly fontSize$ = new BehaviorSubject(14);
  readonly format$ = new Subject();
  readonly theme$: BehaviorSubject<string>;
  expires: Date | null = null;

  readonly model = monaco.editor.createModel('', this.language$.getValue());
  private $: Subscription[] = [];

  constructor() {
    const initialTheme = localStorage.getItem(THEME_KEY) || 'vs-dark';
    this.theme$ = new BehaviorSubject(initialTheme);
    this.$.push(
      this.language$.pipe(distinctUntilChanged()).subscribe((language) => {
        monaco.editor.setModelLanguage(this.model, language);
      }),
      this.theme$.subscribe((theme) => {
        localStorage.setItem(THEME_KEY, theme);
        monaco.editor.setTheme(theme);
      }),
    );
    const languages = monaco.languages.getLanguages();
    const extensionMap = new Map<string, string>();
    this.languageOptions = languages.map(({ id, aliases, extensions }) => {
      if (extensions) {
        extensions.forEach((extension) => {
          extensionMap.set(extension, id);
        });
      }
      return {
        value: id,
        text: aliases?.[0] || id,
      };
    });
    this.extensions = extensionMap;
  }

  format() {
    this.format$.next();
  }

  getFileType(filename: string): string | undefined {
    const dot = filename.lastIndexOf(".");
    if (dot === -1) {
      return undefined;
    }
    const extension = filename.substring(dot);
    return this.extensions.get(extension);
  }

  ngOnDestroy() {
    this.$.forEach((it) => it.unsubscribe());
    this.$ = [];
  }
}
