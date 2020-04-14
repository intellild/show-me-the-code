import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'preference-popup',
  template: `
    <mat-card class="container">
      <ng-select [items]="simpleItems"
                 [(ngModel)]="selectedSimpleItem">
      </ng-select>
    </mat-card>
  `,
  styles: [
    `
      .container {
        /*display: grid;*/
        /*grid-template-columns: auto auto;*/
        /*grid-auto-rows: minmax(40px, auto);*/
        /*align-items: center;*/
      }
    `
  ]
})
export class PreferencePopupComponent {
  selectedSimpleItem = 'Two';
  simpleItems = [true, 'Two', 3];
}
