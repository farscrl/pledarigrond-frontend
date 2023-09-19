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
      const clipboardItemInput = new ClipboardItem({
        'text/plain': new Blob([this.editor.getText()], {type: 'text/plain'}),
        'text/html' : new Blob([this.editor.getHTML()], {type: 'text/html'})
      });
      navigator.clipboard.write([clipboardItemInput]);
    }
  }
}
