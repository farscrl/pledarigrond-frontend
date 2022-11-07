import {Component, Input, OnInit} from '@angular/core';
import { Editor } from '@tiptap/core';

@Component({
  selector: 'app-spellchecker-menubar',
  templateUrl: './spellchecker-menubar.component.html',
  styleUrls: ['./spellchecker-menubar.component.scss']
})
export class SpellcheckerMenubarComponent implements OnInit {

  @Input()
  editor?: Editor;

  constructor() { }

  ngOnInit(): void {
  }

  copy() {
    if (this.editor) {
      const blobInput = new Blob([this.editor.getHTML()], {type: 'text/html'});
      const clipboardItemInput = new ClipboardItem({'text/html' : blobInput});
      navigator.clipboard.write([clipboardItemInput]);
    }
  }
}
