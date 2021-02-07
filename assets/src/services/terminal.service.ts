import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';

@Injectable()
export class TerminalService {
  readonly write$ = new Subject<string>();

  write(data: string) {
    this.write$.next(data);
  }
}
