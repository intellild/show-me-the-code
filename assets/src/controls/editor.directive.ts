import { AfterViewInit, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { observe } from 'mobx';
import { observable } from 'mobx-angular';
import * as monaco from 'monaco-editor';

@Directive({
  selector: 'monaco-editor',
})
export class EditorDirective implements AfterViewInit, OnDestroy {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private resizeObserver: ResizeObserver;
  private readonly $$: (() => void)[] = [];

  @Input()
  @observable.ref
  model: monaco.editor.ITextModel | null = null;

  constructor(private readonly viewContainerRef: ViewContainerRef) {
    this.resizeObserver = new ResizeObserver(() => {
      this.editor?.layout();
    });
  }

  ngAfterViewInit(): void {
    const element = this.viewContainerRef.element.nativeElement;
    this.editor = monaco.editor.create(element, {
      model: this.model,
      theme: 'vs-dark',
    });
    this.resizeObserver.observe(element);
    this.$$.push(
      observe(this, 'model', () => {
        this.editor?.setModel(this.model);
      }),
    );
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.editor = null;
    this.resizeObserver.disconnect();
  }
}
