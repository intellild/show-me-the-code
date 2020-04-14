import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MobxAngularModule } from "mobx-angular";
import { InputComponent } from "../controls/input.component";

import { AppComponent } from './app.component';
import { EditorDirective } from "./editor.directive";
import { PreferencePopupComponent } from "./preference-popup.component";
import { PreferenceComponent } from "./preference.component";

@NgModule({
  declarations: [
    AppComponent,
    EditorDirective,
    InputComponent,
    PreferenceComponent,
    PreferencePopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MobxAngularModule,
    OverlayModule,
    PortalModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
