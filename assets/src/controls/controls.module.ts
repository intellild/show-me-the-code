import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { DrawerComponent } from './drawer.component';
import { DrawerService } from './drawer.service';
import { EditorDirective } from './editor.directive';
import { InputComponent } from './input.component';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [DrawerComponent, EditorDirective, InputComponent, SelectComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MobxAngularModule, OverlayModule, PortalModule],
  providers: [DrawerService],
  exports: [DrawerComponent, EditorDirective, InputComponent, SelectComponent],
})
export class ControlsModule {}
