import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { TerminalService } from '../services/terminal.service';
import { EditorDirective } from './editor.directive';
import { NotificationListComponent } from './notification-list.component';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';
import { PopDirective } from './pop.directive';
import { SelectComponent } from './select.component';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';
import { TerminalDirective } from './terminal.directive';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';
import { TextOnlyNotificationComponent } from './text-only-notification.component';

@NgModule({
  declarations: [
    DialogComponent,
    EditorDirective,
    NotificationComponent,
    NotificationListComponent,
    PopDirective,
    SelectComponent,
    SpinnerComponent,
    TerminalDirective,
    TextOnlyNotificationComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, MobxAngularModule, OverlayModule, PortalModule],
  providers: [DialogService, NotificationService, SpinnerService, TerminalService],
  exports: [
    DialogComponent,
    EditorDirective,
    NotificationComponent,
    NotificationListComponent,
    PopDirective,
    SelectComponent,
    SpinnerComponent,
    TerminalDirective,
    TextOnlyNotificationComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ControlsModule {}
