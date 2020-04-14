import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { EditorDirective } from "./editor.directive";
import { PreferencePopupComponent } from "./preference-popup.component";
import { PreferenceComponent } from "./preference.component";

@NgModule({
  declarations: [
    AppComponent,
    EditorDirective,
    PreferenceComponent,
    PreferencePopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    NgSelectModule,
    OverlayModule,
    PortalModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
