import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from 'mobx-angular';
import { ControlsModule } from '../controls/controls.module';

import { AppComponent } from './app.component';
import { PreferenceComponent } from './preference.component';

@NgModule({
  declarations: [AppComponent, PreferenceComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ControlsModule, MobxAngularModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
