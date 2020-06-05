import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { TerminalService } from '../services/terminal.service';
import { EditorDirective } from './editor.directive';
import { InputComponent } from './input.component';
import { PopDirective } from './pop.directive';
import { SelectComponent } from './select.component';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';
import { TabsComponent } from "./tabs.component";
import { TerminalDirective } from './terminal.directive';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [
    DialogComponent,
    EditorDirective,
    InputComponent,
    PopDirective,
    SelectComponent,
    SpinnerComponent,
    TabsComponent,
    TerminalDirective,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, MobxAngularModule, OverlayModule, PortalModule],
  providers: [DialogService, SpinnerService, TerminalService],
  exports: [EditorDirective, InputComponent, PopDirective, SelectComponent, SpinnerComponent, TerminalDirective, TabsComponent],
})
export class ControlsModule {}
