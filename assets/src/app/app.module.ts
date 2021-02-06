import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { ControlsModule } from '../controls/controls.module';
import { CollaborativeService } from '../services/collaborative.service';
import { ConnectionService } from '../services/connection.service';
import { EditorService } from '../services/editor.service';
import { TerminalService } from '../services/terminal.service';
import { GithubService } from '../services/github.service';
import { AppOverlayContainer } from './app-overlay-container';

import { AppComponent } from './app.component';
import { LanguageSelectComponent } from './language-select.component';
import { PreferenceComponent } from './preference.component';
import { ShelfComponent } from './shelf.component';

@NgModule({
  declarations: [AppComponent, LanguageSelectComponent, ShelfComponent, PreferenceComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ControlsModule, MobxAngularModule, ScrollingModule],
  providers: [
    CollaborativeService,
    ConnectionService,
    EditorService,
    GithubService,
    TerminalService,
    {
      provide: OverlayContainer,
      useClass: AppOverlayContainer,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
