import { Injectable, OnDestroy } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const THEME_KEY = 'THEME';

@Injectable()
export class EditorService implements OnDestroy {
  readonly language$ = new BehaviorSubject('javascript');
  readonly fontSize$ = new BehaviorSubject(14);
  readonly expired$ = new BehaviorSubject(false);
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
  }

  format() {
    this.format$.next();
  }

  ngOnDestroy() {
    this.$.forEach((it) => it.unsubscribe());
    this.$ = [];
  }
}
