import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

/**
 * Whether we're in a testing environment.
 * TODO(crisbeto): remove this once we have an overlay testing module.
 */
const isTestEnvironment: boolean =
  typeof window !== 'undefined' && !!window && !!((window as any).__karma__ || (window as any).jasmine);

@Injectable({ providedIn: 'root' })
export class AppOverlayContainer extends OverlayContainer {
  /**
   * Create the overlay container element, which is simply a div
   * with the 'cdk-overlay-container' class on the document body.
   */
  protected _createContainer(): void {
    const containerClass = 'cdk-overlay-container';

    if (this._platform.isBrowser || isTestEnvironment) {
      const oppositePlatformContainers = this._document.querySelectorAll(
        `.${containerClass}[platform="server"], ` + `.${containerClass}[platform="test"]`,
      );

      // Remove any old containers from the opposite platform.
      // This can happen when transitioning from the server to the client.
      for (let i = 0; i < oppositePlatformContainers.length; i++) {
        oppositePlatformContainers[i].parentNode!.removeChild(oppositePlatformContainers[i]);
      }
    }

    const container = this._document.createElement('div');
    container.classList.add(containerClass);

    // A long time ago we kept adding new overlay containers whenever a new app was instantiated,
    // but at some point we added logic which clears the duplicate ones in order to avoid leaks.
    // The new logic was a little too aggressive since it was breaking some legitimate use cases.
    // To mitigate the problem we made it so that only containers from a different platform are
    // cleared, but the side-effect was that people started depending on the overly-aggressive
    // logic to clean up their tests for them. Until we can introduce an overlay-specific testing
    // module which does the cleanup, we try to detect that we're in a test environment and we
    // always clear the container. See #17006.
    // TODO(crisbeto): remove the test environment check once we have an overlay testing module.
    if (isTestEnvironment) {
      container.setAttribute('platform', 'test');
    } else if (!this._platform.isBrowser) {
      container.setAttribute('platform', 'server');
    }

    this._document.getElementById('container')?.appendChild(container);
    this._containerElement = container;
  }
}
