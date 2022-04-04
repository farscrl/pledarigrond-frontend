import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { EditorQuery } from 'src/app/models/editor-query';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent implements OnInit {

  @Output()
  dateRangeSelected = new EventEmitter<EditorQuery>();

  @Input()  set userFilter(userFilter: string | undefined)  { this.selectedUserFilter = userFilter; this.filter(); };

  @Input()  set verifierFilter(verifierFilter: string | undefined) { this.selectedVerifierFilter = verifierFilter; this.filter(); };

  selectedDuration: Date[] = [];
  selectedUserFilter?: string;
  selectedVerifierFilter?: string;

  private editorQuery: EditorQuery = new EditorQuery();

  constructor() { }

  ngOnInit(): void {
    this.resetDate();
  }

  filter() {
    this.editorQuery.startTime = !!this.selectedDuration[0] ? this.selectedDuration[0].getTime() : undefined;
    this.editorQuery.endTime = !!this.selectedDuration[1] ? this.selectedDuration[1].getTime() : undefined;
    this.editorQuery.userOrIp = !!this.selectedUserFilter ? this.selectedUserFilter : undefined;
    this.editorQuery.verifier = !!this.selectedVerifierFilter ? this.selectedVerifierFilter : undefined;

    this.dateRangeSelected.emit(this.editorQuery);
  }

  resetDate() {
    this.selectedDuration = [
      moment().subtract(6, 'months').toDate(),
      moment().toDate()
    ]
    this.selectedUserFilter = undefined;
    this.selectedVerifierFilter = undefined;
    this.filter();
  }

  removeUserFilter() {
    this.userFilter = undefined;
  }

  removeVerifierFilter() {
    this.verifierFilter = undefined;
  }
}
