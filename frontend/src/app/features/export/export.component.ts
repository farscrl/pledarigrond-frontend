import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {NgxModalComponent, NgxModalService} from "ngx-modalview";
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';
import { MatomoTracker } from "ngx-matomo-client";

import { TranslatePipe } from '@ngx-translate/core';
import { TranslateCutPipe } from '../../pipes/translate-cut.pipe';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
    imports: [TranslatePipe, TranslateCutPipe]
})
export class ExportComponent extends NgxModalComponent<null, null>  implements OnInit {
  authService = inject(AuthService);
  private exportService = inject(ExportService);
  private modalService = inject(NgxModalService);
  private selectedLanguageService = inject(SelectedLanguageService);
  private router = inject(Router);
  private tracker = inject(MatomoTracker);


  ngOnInit(): void {
  }

  closeOverlay() {
    this.modalService.removeAll();
  }

  export() {
    this.tracker.trackEvent("EXPORT", 'export ' + this.selectedLanguageService.getSelectedLanguageUrlSegment(), this.authService.getUsername());
    this.exportService.getJsonZip(this.selectedLanguageService.getSelectedLanguageUrlSegment()).subscribe(data => {
      this.downloadFile(data, "pledarigrond_export_json_" + this.selectedLanguageService.getSelectedLanguageUrlSegment() + ".zip", "application/zip");
    });
  }

  login() {
    this.closeOverlay();
    this.router.navigate([this.selectedLanguageService.getSelectedLanguageUrlSegment() + "/login"]);
  }

  private downloadFile(data: any, fileName: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', fileName);
    a.setAttribute('style', 'display: none');
    document.getElementsByTagName('body')[0].appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
