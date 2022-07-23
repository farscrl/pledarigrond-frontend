import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-spellchecker-context-menu',
  templateUrl: './spellchecker-context-menu.component.html',
  styleUrls: ['./spellchecker-context-menu.component.scss']
})
export class SpellcheckerContextMenuComponent implements OnInit {

  @Input()
  contextMenuItems: string[] = [];

  @Output()
  onContextMenuItemClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onContextMenuClick(data: string): any {
    this.onContextMenuItemClick.emit(data);
  }
}
