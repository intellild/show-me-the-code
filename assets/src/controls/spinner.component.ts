import { Component } from "@angular/core";

@Component({
  selector: 'app-spinner',
  template:
      `
    <div class="circle"></div>
  `,
  styles: [
      `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      .circle {
        box-sizing: border-box;
        border-radius: 50%;
        border-style: solid;
        border-width: 3px;
        border-color: rgb(0, 120, 212) rgb(199, 224, 244) rgb(199, 224, 244);
        border-image: none 100% / 1 / 0 stretch;
        animation-name: spinner;
        animation-duration: 1.3s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67);
        width: 40px;
        height: 40px;
      }

    `
  ]
})
export class SpinnerComponent {

}
