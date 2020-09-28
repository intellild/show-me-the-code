import { Component, Directive } from "@angular/core";

@Component({
  selector: "app-button",
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        color: rgb(255, 255, 255);
        background-color: rgb(14, 99, 156);
        cursor: pointer;
        padding: 5px 10px;
        margin: 4px 5px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
      }

      :host:hover {
        background-color: rgb(17, 119, 187);
      }
    `
  ]
})
export class ButtonComponent {

}
