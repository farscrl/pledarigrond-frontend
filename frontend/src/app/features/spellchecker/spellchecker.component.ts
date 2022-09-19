import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker';
import { Proofreader } from 'src/app/utils/proofreader';
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Hunspell, HunspellFactory, loadModule } from 'hunspell-asm';

@Component({
  selector: 'app-spellchecker',
  templateUrl: './spellchecker.component.html',
  styleUrls: ['./spellchecker.component.scss']
})
export class SpellcheckerComponent implements OnInit {

  editor?: Editor;
  value = '<p></p>';

  hunspellFactory?: HunspellFactory;
  affFile?: string;
  dictFile?: string;
  hunspell?: Hunspell;

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.unloadDictionary();
  }

  isLoadingData = true;
  version = "";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadVersion();
    this.loadDictionary();
  }

  onDictLoaded() {
    this.isLoadingData = false;
    console.log("loading spellchecker finished");
    const proofreader = new Proofreader(this.hunspell!);

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

  private async loadDictionary() {
    this.hunspellFactory = await loadModule();

    const aff = await fetch('assets/hunspell/rm-surmiran/rm-surmiran.aff');
    const affBuffer = new Uint8Array(await aff.arrayBuffer());
    this.affFile = this.hunspellFactory.mountBuffer(affBuffer, 'rm-surmiran.aff');

    const dic = await fetch('assets/hunspell/rm-surmiran/rm-surmiran.dic');
    const dicBuffer = new Uint8Array(await dic.arrayBuffer());
    this.dictFile = this.hunspellFactory.mountBuffer(dicBuffer, 'rm-surmiran.dic');

    this.hunspell = this.hunspellFactory.create(this.affFile, this.dictFile);
    this.onDictLoaded();
  }

  private async unloadDictionary() {
    this.hunspellFactory?.unmount(this.affFile!);
    this.hunspellFactory?.unmount(this.dictFile!);
  }
}
