import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleModalComponent, SimpleModalService } from "ngx-simple-modal";
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export.service';
import { SelectedLanguageService } from 'src/app/services/selected-language.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent extends SimpleModalComponent<null, null>  implements OnInit {

  constructor(
    public authService: AuthService,
    private exportService: ExportService,
    private simpleModalService: SimpleModalService,
    private selectedLanguageService: SelectedLanguageService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  closeOverlay() {
    this.simpleModalService.removeAll();
  }

  export() {
    this.exportService.getJsonZip(this.selectedLanguageService.getSelectedLanguageUrlSegment()).subscribe(data => {
      this.downloadFile(data, "pledarigrond_export_json_" + this.selectedLanguageService.getSelectedLanguageUrlSegment() + ".zip", "application/zip ");
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
