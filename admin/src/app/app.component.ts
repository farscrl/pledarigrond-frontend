import { Component, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, map } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet]
})
export class AppComponent {
  private swUpdate = inject(SwUpdate);

  constructor() {

    if (this.swUpdate.isEnabled) {
      // check every 6 hours while the tab is open
      interval(6 * 60 * 60 * 1000).subscribe(() => {
        this.swUpdate.checkForUpdate().catch(() => { /* ignore errors */ });
      });

      // reload when new version is ready
      this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map(evt => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        }))).subscribe((event) => {
        console.log('current version: ', event.current);
        console.log('available version: ', event.available);
        this.swUpdate.activateUpdate().then(() => {
          window.location.reload()
        });
      });
    }
  }
}
