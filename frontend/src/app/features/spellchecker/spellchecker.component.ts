import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker';
import { Proofreader } from 'src/app/utils/proofreader';
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Hunspell, HunspellFactory, loadModule } from 'hunspell-asm';
import { Subscription } from "rxjs";
import { SelectedLanguageService } from "../../services/selected-language.service";
import { TranslateService } from "@ngx-translate/core";
import { MatomoTracker } from "@ngx-matomo/tracker";
import { ModificationService } from "../../services/modification.service";
import { LemmaVersion } from "../../models/lemma-version";
import { AuthService } from "../../services/auth.service";
import { SimpleModalService } from "ngx-simple-modal";
import { ManualsSpellcheckerComponent, ManualType } from "./manuals-spellchecker/manuals-spellchecker.component";
import { ActivatedRoute } from "@angular/router";

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

  isLoadingData = true;
  version = "";

  idiom = '';
  idiomUrl = '';
  private idiomSubscription?: Subscription;

  sentSuggestion = false;
  sentSuggestionWord = '';

  constructor(
    private http: HttpClient,
    private selectedLanguageService: SelectedLanguageService,
    private translateService: TranslateService,
    private tracker: MatomoTracker,
    private modificationService: ModificationService,
    private authService: AuthService,
    private simpleModalService: SimpleModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(lng => {
      this.idiomUrl = this.selectedLanguageService.getSelectedLanguageUrlSegment();
      this.idiom = lng;

      this.loadVersion();
      this.loadDictionary();
    });

    this.route.queryParams
      .subscribe(params => {
        if (params['testar']) {
          this.loadTestingFile();
        }
      });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.unloadDictionary();

    if (this.idiomSubscription) {
      this.idiomSubscription.unsubscribe();
    }
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
          },
          onShowSuggestionsEvent: this.updateSuggestionBox.bind(this)
        })
      ],
    });
  }

  closeSuggestionNotification() {
    this.sentSuggestion = false;
  }

  openManual(manualType: ManualType) {
    this.simpleModalService.addModal(ManualsSpellcheckerComponent, { manualType: manualType}).subscribe();
  }

  private async loadTestingFile() {
    const test = await fetch(`assets/hunspell/tests/rm-${this.idiom}-test.html`);
    this.value = await test.text();
  }

  private updateSuggestionBox(word: string) {
    const suggestionText = document.createElement('span');
    suggestionText.className = 'suggestion-text';
    suggestionText.innerText = 'Trametter quest pled a la Lia Rumantscha sco proposta';

    const suggestionLink = document.createElement("div");
    suggestionLink.className = 'suggestion-link';
    suggestionLink.addEventListener('click', (evt) => {
      this.suggestWord(word);
      evt.preventDefault();
    }, false);
    suggestionLink.appendChild(document.createTextNode('→ '));
    suggestionLink.appendChild(suggestionText);

    const suggestionsBox = document.getElementById('suggestions-box');
    if (suggestionsBox) {
      suggestionsBox.append(suggestionLink);

      // adding focus to suggestions-box, to allow clicking in the box
      suggestionsBox.addEventListener('mouseover', () => {
        suggestionsBox.focus();
      });
    }
  }

  private suggestWord(word: string) {
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lemmaValues.RStichwort = word;
    lemmaVersion.lemmaValues.DStichwort = '';
    lemmaVersion.lemmaValues.contact_comment = 'Proposta via spellchecker online';
    lemmaVersion.lemmaValues.contact_email = this.authService.getUsername();

    this.tracker.trackEvent('PROPOSTA-SPELLCHECKER', 'proposta spellcheker ' + this.selectedLanguageService.getSelectedLanguageUrlSegment());
    this.modificationService.create(this.selectedLanguageService.getSelectedLanguageUrlSegment(), lemmaVersion).subscribe(data => {
      this.sentSuggestion = true;
      this.sentSuggestionWord = word;

      const suggestionsBox = document.getElementById('suggestions-box');
      if (suggestionsBox) {
        suggestionsBox.textContent = '';
        suggestionsBox.style.display = 'none'
      }
    }, error => {
      console.error(error);
    });
  }

  private loadVersion() {
    this.http.get(`assets/hunspell/rm-${this.idiom}/rm-${this.idiom}_version.txt`, {responseType: 'text'}).subscribe(version => {
      this.version = version;
    });
  }

  private async loadDictionary() {
    this.hunspellFactory = await loadModule();

    const aff = await fetch(`assets/hunspell/rm-${this.idiom}/rm-${this.idiom}.aff`);
    const affBuffer = new Uint8Array(await aff.arrayBuffer());
    this.affFile = this.hunspellFactory.mountBuffer(affBuffer, 'rm-${this.idiom}.aff');

    const dic = await fetch(`assets/hunspell/rm-${this.idiom}/rm-${this.idiom}.dic`);
    const dicBuffer = new Uint8Array(await dic.arrayBuffer());
    this.dictFile = this.hunspellFactory.mountBuffer(dicBuffer, `rm-${this.idiom}.dic`);

    this.hunspell = this.hunspellFactory.create(this.affFile, this.dictFile);
    this.onDictLoaded();
  }

  private async unloadDictionary() {
    this.hunspellFactory?.unmount(this.affFile!);
    this.hunspellFactory?.unmount(this.dictFile!);
  }
}
