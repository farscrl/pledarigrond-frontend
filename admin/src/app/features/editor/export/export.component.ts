import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  allChecked = false;
  indeterminate = false;
  checkOptionsOne = [
    { label: 'German', value: 'DStichwort', checked: false },
    { label: 'Grammar (de)', value: 'Pear', checked: false },
    { label: 'Genus (de)', value: 'Orange', checked: false },
    { label: 'Semantic (de)', value: 'DStichwort', checked: false },
    { label: 'Category', value: 'Pear', checked: false },
    { label: 'Link (de)', value: 'Orange', checked: false },
    { label: 'Romansh', value: 'DStichwort', checked: false },
    { label: 'Grammar (rm)', value: 'Pear', checked: false },
    { label: 'Genus (rm)', value: 'Orange', checked: false },
    { label: 'Semantic (rm)', value: 'DStichwort', checked: false },
    { label: 'Link (rm)', value: 'Pear', checked: false },
    { label: 'Conjugation', value: 'Orange', checked: false },
    { label: 'Additional search terms', value: 'DStichwort', checked: false },
    { label: 'Comment', value: 'Pear', checked: false },
  ];

  isExporting = false;

  constructor(private modal: NzModalRef, private editorService: EditorService) {

  }

  ngOnInit(): void {

  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  cancel() {
    this.modal.close();
  }

  export() {
    this.isExporting = true;

  }
}
