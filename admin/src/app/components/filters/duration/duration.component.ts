import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent implements OnInit {

  @Output()
  dateRangeSelected = new EventEmitter<Date[]>();

  selectedDuration: Date[] = [];

  constructor() { }

  ngOnInit(): void {
    this.resetDate();
  }

  filter() {
    console.log(this.selectedDuration);
    this.dateRangeSelected.emit(this.selectedDuration);
  }

  resetDate() {
    this.selectedDuration = [
      moment().subtract(6, 'months').toDate(),
      moment().toDate()
    ]
  }
}
