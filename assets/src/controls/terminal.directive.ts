import { AfterViewInit, Directive, OnDestroy, ViewContainerRef } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { TerminalService } from '../services/terminal.service';

@Directive({
  selector: 'app-terminal',
})
export class TerminalDirective implements AfterViewInit, OnDestroy {
  private readonly term = new Terminal({
    disableStdin: true,
  });
  private readonly fitAddon = new FitAddon();
  private readonly searchAddon = new SearchAddon();
  private readonly resizeObserver = new ResizeObserver(() => {
    this.fitAddon.fit();
  });

  constructor(private readonly terminalService: TerminalService, private readonly viewContainerRef: ViewContainerRef) {
    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(this.searchAddon);
    this.terminalService.write$.subscribe((data) => {
      this.term.write(data);
    });
  }

  ngAfterViewInit(): void {
    const el = this.viewContainerRef.element.nativeElement;
    this.term.open(el);
    this.fitAddon.fit();
    this.resizeObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.term.dispose();
    this.resizeObserver.disconnect();
  }
}
