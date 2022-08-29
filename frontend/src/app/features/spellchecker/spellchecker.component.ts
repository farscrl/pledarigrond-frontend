import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// @ts-ignore
import Typo from 'typo-js';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker';
import { Proofreader } from 'src/app/utils/proofreader';
import {Underline} from "@tiptap/extension-underline";
import {TaskList} from "@tiptap/extension-task-list";
import {Highlight} from "@tiptap/extension-highlight";

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

  isLoadingData = true;
  dictionary: any;
  version = "";

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
      extensions: [
        StarterKit,
        Underline,
        Highlight,
         SpellcheckerExtension.configure({
          proofreader: proofreader,
          uiStrings: {
            noSuggestions: 'Catto nignas propostas'
          }
        })
      ],
    });
  }

  private loadVersion() {
    this.http.get('assets/hunspell/rm-surmiran/version.txt', {responseType: 'text'}).subscribe(version => {
      this.version = version;
  });
  }
}
