import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { TerminalService } from '../services/terminal.service';
import { ButtonComponent } from './button.component';
import { CheckboxComponent } from "./checkbox.component";
import { EditorDirective } from './editor.directive';
import { InputComponent } from './input.component';
import { NotificationListComponent } from "./notification-list.component";
import { NotificationComponent } from "./notification.component";
import { NotificationService } from "./notification.service";
import { PopDirective } from './pop.directive';
import { SelectComponent } from './select.component';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';
import { TabsComponent } from './tabs.component';
import { TerminalDirective } from './terminal.directive';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [
    ButtonComponent,
    CheckboxComponent,
    DialogComponent,
    EditorDirective,
    InputComponent,
    NotificationComponent,
    NotificationListComponent,
    PopDirective,
    SelectComponent,
    SpinnerComponent,
    TabsComponent,
    TerminalDirective,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, MobxAngularModule, OverlayModule, PortalModule],
  providers: [DialogService, NotificationService, SpinnerService, TerminalService],
  exports: [
    ButtonComponent,
    CheckboxComponent,
    EditorDirective,
    InputComponent,
    PopDirective,
    SelectComponent,
    SpinnerComponent,
    TerminalDirective,
    TabsComponent,
  ],
})
export class ControlsModule {}
