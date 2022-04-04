import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { EditorQuery } from 'src/app/models/editor-query';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent implements OnInit {

  @Input()
  nameOrIpFilter?: string;

  @Output()
  dateRangeSelected = new EventEmitter<EditorQuery>();

  selectedDuration: Date[] = [];

  private editorQuery: EditorQuery = new EditorQuery();

  constructor() { }

  ngOnInit(): void {
    this.resetDate();
  }

  filter() {
    this.editorQuery.startTime = !!this.selectedDuration[0] ? this.selectedDuration[0].getTime() : undefined;
    this.editorQuery.endTime = !!this.selectedDuration[1] ? this.selectedDuration[1].getTime() : undefined;
    this.editorQuery.userOrIp = !!this.nameOrIpFilter ? this.nameOrIpFilter : undefined;

    this.dateRangeSelected.emit(this.editorQuery);
  }

  resetDate() {
    this.selectedDuration = [
      moment().subtract(6, 'months').toDate(),
      moment().toDate()
    ]
    this.filter();
  }
}
