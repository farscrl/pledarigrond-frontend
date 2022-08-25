import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
// @ts-ignore
import Typo from 'typo-js';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker';
import { Proofreader } from 'src/app/utils/proofreader';

declare var HighlightInTextarea: any;

@Component({
  selector: 'app-spellchecker',
  templateUrl: './spellchecker.component.html',
  styleUrls: ['./spellchecker.component.scss']
})
export class SpellcheckerComponent implements OnInit {

  editor?: Editor;

  value = '<p></p>';

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  textToSpell = "";

  isLoadingData = true;
  dictionary: any;
  spellingErrors: string[] = [];
  wordList: string[] = [];
  version = "";

  selectedText = "";
  searchSuggestions: string[] = [];
  contextMenuVisible = false;
  rightClickMenuPositionX: number = 100;
  rightClickMenuPositionY: number = 100;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.dictionary = new Typo("rm-surmiran", false, false, {
      dictionaryPath: "assets/hunspell/",
      asyncLoad: true,
      loadedCallback: this.onDictLoaded.bind(this)
    });

    this.loadVersion();
  }

  onDictLoaded() {
    this.isLoadingData = false;
    console.log("loading spellchecker finished");
    const proofreader = new Proofreader(this.dictionary);

    this.editor = new Editor({
      extensions: [StarterKit, SpellcheckerExtension.configure({ proofreader: proofreader })],
    });
  }

  private loadVersion() {
    this.http.get('assets/hunspell/rm-surmiran/version.txt', {responseType: 'text'}).subscribe(version => {
      this.version = version;
  });
  }
}
