import { Component, OnInit } from '@angular/core';
import { LemmaVersion } from 'src/app/models/lemma-version';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss']
})
export class VersionHistoryComponent implements OnInit {
  loading = false;
  versionHistory: readonly LemmaVersion[] = [new LemmaVersion(), new LemmaVersion(), new LemmaVersion(), new LemmaVersion()];

  constructor() { }

  ngOnInit(): void {

  }
}
