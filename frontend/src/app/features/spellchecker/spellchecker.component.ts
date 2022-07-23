import { Component, OnInit } from '@angular/core';
// @ts-ignore
import Typo from 'typo-js';

declare var HighlightInTextarea: any;

@Component({
  selector: 'app-spellchecker',
  templateUrl: './spellchecker.component.html',
  styleUrls: ['./spellchecker.component.scss']
})
export class SpellcheckerComponent implements OnInit {

  textToSpell = "Chegl è en test da funcziung.";

  isLoadingData = true;
  dictionary: any;
  spellingErrors: string[] = [];
  wordList: string[] = [];

  textareaHighlighter: any;

  constructor() { }

  ngOnInit(): void {
    this.dictionary = new Typo("rm-surmiran", false, false, {
      dictionaryPath: "assets/hunspell/",
      asyncLoad: true,
      loadedCallback: this.onDictLoaded.bind(this)
    });

    this.textareaHighlighter = new HighlightInTextarea('#speller', {
      highlight: this.highlightWords.bind(this)
    });
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
    //$(mt_check).highlightWithinTextarea('update');
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
      a[i].trim().replace(/[.,?!\s]/g, '').replace(/’/g, "'"));

    return wordList;
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
    if (key.keyCode == 32 || key.keyCode == 8 || key.keyCode == 46) { // space/backspace/delete
      this.checkSpelling();
    }
  }

  onPaste(event: ClipboardEvent) {
    setTimeout(this.checkSpelling.bind(this), 300);
  }
}

/*
var selectedText;



function bindListeners() {



  $('.mt_check').on('long-press', function(e){
    e.preventDefault();
    selectedText = getTouchSelectionText();
    suggestions = getSuggestions(selectedText);
    showContextMenu(suggestions);
  });

  // All of the below is for the context menu
  // Show the menu when a word in the textarea is right-clicked
  $(".mt_check").bind("contextmenu", function(event) {
    event.preventDefault();
    selectedText = getSelectionText();
    suggestions = getSuggestions(selectedText);
    showContextMenu(suggestions);
  });

  // Hide the menu if anywhere else is clicked
  $(document).bind("mousedown", function(e) {
    if (!$(e.target).parents(".custom-menu").length > 0) {
      $(".custom-menu").hide(100);
    }
  });

  // If the menu element is clicked
  $(document).on('click', 'ul.custom-menu li', function(){
    switch ($(this).attr("data-action")) {
      case "no":
        break;
      case "search":
        window.open('https://www.google.com/search?q='+selectedText, '_blank');
        break;
      default:
        let userText = $('.mt_check').val();
        let replacementWord = $(this).attr("data-action");
        let re = new RegExp("\\b" + selectedText + "\\b", "g");
        userText = userText.replace(re, replacementWord);
        $('.mt_check').val(userText);
        $('.mt_check').highlightWithinTextarea('update');
        break;
    }
    $(".custom-menu").hide(100);
  });
}

function showContextMenu(suggestions) {
  let menuEntries = "";
  $.each(suggestions, function(i, suggested){
    menuEntries += "<li data-action='" + suggested + "'>" + suggested + "</li>";
  });
  if (menuEntries == "") {
    menuEntries = "<li data-action='no'>No suggestions</li>";
  }
  menuEntries += "<li data-action='search'>Search Google for ''" + selectedText + "''</li>";
  $('.custom-menu').html(menuEntries);

  // Show contextmenu
  $(".custom-menu").finish().toggle(100).css({
    top: (event.pageY - $('#mt_spell_cont').position().top) + "px",
    left: (event.pageX - parseInt($('#mt_spell_cont').css('marginLeft'))) + "px"
  });
}


function

function

function getSelectionText() {
  var text = "";
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    (activeElTagName == "textarea" || activeElTagName == "input") &&
    /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
    (typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
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
