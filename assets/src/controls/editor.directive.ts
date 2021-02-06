import { AfterViewInit, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { observe } from 'mobx';
import { observable } from 'mobx-angular';
import * as monaco from 'monaco-editor';

@Directive({
  selector: 'monaco-editor',
})
export class EditorDirective implements AfterViewInit, OnDestroy {
  private resizeObserver: ResizeObserver;
  private readonly $$: (() => void)[] = [];
  instance: monaco.editor.IStandaloneCodeEditor | null = null;

  @Input()
  @observable.ref
  model: monaco.editor.ITextModel | null = null;

  constructor(private readonly viewContainerRef: ViewContainerRef) {
    this.resizeObserver = new ResizeObserver(() => {
      this.instance?.layout();
    });
  }

  ngAfterViewInit(): void {
    const element = this.viewContainerRef.element.nativeElement;
    this.instance = monaco.editor.create(element, {
      model: this.model,
      theme: 'vs-dark',
    });
    this.resizeObserver.observe(element);
    this.$$.push(
      observe(this, 'model', () => {
        this.instance?.setModel(this.model);
      }),
    );
  }

  ngOnDestroy(): void {
    this.instance?.dispose();
    this.instance = null;
    this.resizeObserver.disconnect();
  }
}
