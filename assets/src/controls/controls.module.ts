import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { EditorDirective } from './editor.directive';
import { InputComponent } from './input.component';
import { PopDirective } from './pop.directive';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [EditorDirective, InputComponent, PopDirective, SelectComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MobxAngularModule, OverlayModule, PortalModule],
  providers: [],
  exports: [EditorDirective, InputComponent, PopDirective, SelectComponent],
})
export class ControlsModule {}
