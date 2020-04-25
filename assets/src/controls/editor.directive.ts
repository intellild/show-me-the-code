import { AfterViewInit, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import * as monaco from 'monaco-editor';

@Directive({
  selector: 'monaco-editor',
})
export class EditorDirective implements AfterViewInit, OnDestroy {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private resizeObserver: ResizeObserver;

  @Input()
  model: monaco.editor.ITextModel;

  private readonly disposers: (() => void)[] = [];

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
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.editor = null;
    this.resizeObserver.disconnect();
  }
}
