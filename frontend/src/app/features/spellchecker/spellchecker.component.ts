import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
// @ts-ignore
import Typo from 'typo-js';

declare var HighlightInTextarea: any;

@Component({
  selector: 'app-spellchecker',
  templateUrl: './spellchecker.component.html',
  styleUrls: ['./spellchecker.component.scss']
})
export class SpellcheckerComponent implements OnInit {

  textToSpell = "";

  isLoadingData = true;
  dictionary: any;
  spellingErrors: string[] = [];
  wordList: string[] = [];
  version = "";

  textareaHighlighter: any;

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

    this.textareaHighlighter = new HighlightInTextarea('#speller', {
      highlight: this.highlightWords.bind(this)
    });
    this.loadVersion();
  }

  onDictLoaded() {
    this.isLoadingData = false;
    console.log("loading finished");
    this.checkSpelling();
    //bindListeners();
  }

  checkSpelling() {
    console.debug("-----------------------------NEW WORD---------------------------------------");
    this.spellingErrors = [];

    console.debug("RAW TEXT: " + this.textToSpell);

    this.wordList = this.tokenizeText(this.textToSpell);

    for (const word of this.wordList) {
      console.debug("PROCESSING WORD: " + word)
      if (word != '' && word != ' ' && word.length > 1 && !this.dictionary.check(word)) {
        console.debug("ERROR FOUND: " + word)
        this.spellingErrors.push(word);
      }
      console.debug("-----")
    }

    this.textareaHighlighter.handleInput();
  }

  tokenizeText(text: string): string[] {
    // TODO: create better tokenizer

    const wordList: string[] = [];

    // Trim
    text = text.trim();

    // Remove carriage returns and new lines
    //text = text.replace(/[\r\n]+/gm, "");

    // Split by whitespace and fullstops/periods.
    const splittedWords = text.split(/[\s,\.]+/);


    for (const word of splittedWords) {
      wordList.push(word);
    }

    // Clean the words
    wordList.forEach((o, i, a) => a[i] =
      a[i] = this.cleanString(a[i])
    );

    return wordList;
  }

  private cleanString(string: string): string {
    return string.trim().replace(/[.,?!\s]/g, '').replace(/’/g, "'");
  }

  escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  getSuggestions(word: string): string[] {
    return this.dictionary.suggest(word);
  }

  highlightWords() {
    if (this.spellingErrors.length == 0) {
      return;
    }

    let highlightArr: any[] = [];
    for(const word of this.spellingErrors) {
      let highlightObj: any = {};
      let regex = '\\b' + this.escapeRegExp(word) + '\\b';
      highlightObj.highlight = new RegExp(regex)
      highlightObj.className = 'red';
      highlightArr.push(highlightObj);
    }
    console.log(highlightArr)
    return highlightArr;
  }

  onKeyUp(key: KeyboardEvent) {
    if (key.keyCode == 32 || key.keyCode == 8 || key.keyCode == 46 || key.keyCode == 13) { // space/backspace/delete/enter
      this.checkSpelling();
    }
  }

  onPaste(event: ClipboardEvent) {
    setTimeout(this.checkSpelling.bind(this), 300);
  }

  onClick(event: MouseEvent) {
    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;


    this.selectedText = this.getSelectionText(event.target);
    if (this.selectedText == "") {
      return;
    }
    const suggestions = this.getSuggestions(this.selectedText);
    this.showContextMenu(suggestions);
  }

  onRightClick(event: MouseEvent) {
    this.contextMenuVisible = false;
  }

  click(x: number, y: number) {
    let ev = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'screenX': x,
      'screenY': y
    });

    let el = document.elementFromPoint(x, y);

    if (el) {
      el.dispatchEvent(ev);
    }
}

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }

  private getSelectionText(target: any) {
    var text = "";
    if (target) {
      if (target.tagName && target.tagName.toUpperCase() === "TEXTAREA" && target.selectionStart && typeof target.selectionStart === "number") {
        text = this.getWordAt(target.value, target.selectionStart);
      }
    }
    return this.cleanString(text);
  }

  private getWordAt (str: string, pos: number) {

    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
        return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);

  }

  showContextMenu(suggestions: string[]) {
    this.searchSuggestions = suggestions;
    this.contextMenuVisible = true;
  }

  handleMenuItemClick(suggestion: string) {
    console.log("suggestion selected: " + suggestion);

    let re = new RegExp("\\b" + this.selectedText + "\\b", "g");
    this.textToSpell = this.textToSpell.replace(re, suggestion);
    this.checkSpelling();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (event && event.target && event.target.tagName && event.target.tagName.toUpperCase() === 'TEXTAREA') {
      return;
    }
    this.contextMenuVisible = false;
  }

  private loadVersion() {
    this.http.get('assets/hunspell/rm-surmiran/version.txt', {responseType: 'text'}).subscribe(version => {
      this.version = version;
  });
  }
}

/*

function bindListeners() {

  $('.mt_check').on('long-press', function(e){
    e.preventDefault();
    selectedText = getTouchSelectionText();
    suggestions = getSuggestions(selectedText);
    showContextMenu(suggestions);
  });
}

function getTouchSelectionText() {
  var sel_obj = window.getSelection();
  sel_obj.modify("move","forward","character");
  sel_obj.modify("extend","backward","word");

  sel_obj.modify("move","backward","character");
  sel_obj.modify("extend","forward","word");

  var text = sel_obj.toString().trim();
  text = text.replace(/(^,)|(,$)|(^\.)|(\.$)/g, ""); // remove commas and fullstops
  return text;
}
*/
