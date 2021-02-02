import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { token } from './services/github.service';

if (environment.production) {
  enableProdMode();
}

if (token) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, {
      ngZone: 'noop',
    })
    .catch((err) => console.error(err));
}
