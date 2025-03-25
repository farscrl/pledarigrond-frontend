import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {diffChars} from 'diff'

@Component({
    selector: 'app-diff',
    templateUrl: './diff.component.html',
    styleUrls: ['./diff.component.scss'],
    standalone: false
})
export class DiffComponent implements OnInit, OnChanges {

  @Input()
  old: string|undefined;

  @Input()
  new: string|undefined;

  value = "";

  constructor() { }

  ngOnInit(): void {
    this.calculateDiff();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculateDiff();
  }

  private calculateDiff() {
    if (!this.new && !this.old) {
      this.value = "<span class='none'>–</span>";
      return;
    }

    const diff = diffChars(this.old || '', this.new || '');

    this.value = "";
    diff.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      this.value += "<span class='" + color + "'>" + part.value + "</span>";
    });
  }
}
