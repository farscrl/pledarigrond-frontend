import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService, private swUpdate: SwUpdate) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('rm-rumgr');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('rm-rumgr');

    // reload page on change
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
