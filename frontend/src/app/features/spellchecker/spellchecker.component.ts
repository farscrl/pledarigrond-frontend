import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import SpellcheckerExtension, { IProofreaderInterface, ITextWithPosition } from '@farscrl/tiptap-extension-spellchecker';
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscription } from "rxjs";
import { FrontendLanguage, Idiom, SelectedLanguageService } from "../../services/selected-language.service";
import { TranslateService } from "@ngx-translate/core";
import { MatomoTracker } from "@ngx-matomo/tracker";
import { ModificationService } from "../../services/modification.service";
import { LemmaVersion } from "../../models/lemma-version";
import { AuthService } from "../../services/auth.service";
import { NgxModalService } from "ngx-modalview";
import {
  HunspellLanguage,
  ManualsSpellcheckerComponent,
  ManualType
} from "./manuals-spellchecker/manuals-spellchecker.component";
import { ActivatedRoute } from "@angular/router";
import { Proofreader } from '@farscrl/rumantsch-language-tools';

@Component({
  selector: 'app-spellchecker',
  templateUrl: './spellchecker.component.html',
  styleUrls: ['./spellchecker.component.scss']
})
export class SpellcheckerComponent implements OnInit, IProofreaderInterface {

  editor?: Editor;
  value = '<p></p>';

  isLoadingData = true;

  idiom?: Idiom;
  idiomUrl = '';
  private idiomSubscription?: Subscription;
  private languageSubscription?: Subscription;
  frontEndLanguage: FrontendLanguage = 'rm';

  sentSuggestion = false;
  sentSuggestionWord = '';

  proofreader?: Proofreader.Proofreader;

  constructor(
    private selectedLanguageService: SelectedLanguageService,
    private translateService: TranslateService,
    private tracker: MatomoTracker,
    private modificationService: ModificationService,
    private authService: AuthService,
    private modalService: NgxModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.idiomSubscription = this.selectedLanguageService.getIdiomObservable().subscribe(async (lng) => {
      this.idiomUrl = this.selectedLanguageService.getSelectedLanguageUrlSegment();
      this.idiom = lng;
      await this.loadProofreader();
    });

    this.route.queryParams
      .subscribe(async (params) => {
        if (params['testar']) {
          await this.loadTestingFile();
        }
      });

    this.languageSubscription = this.selectedLanguageService.getFrontendLanguageObservable().subscribe(value => {
      this.frontEndLanguage = value;
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.proofreader?.unload();

    if (this.idiomSubscription) {
      this.idiomSubscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  onDictLoaded() {
    this.isLoadingData = false;
    console.log("loading spellchecker finished");

    this.editor = new Editor({
      extensions: [
        StarterKit,
        Underline,
        Highlight,
        SpellcheckerExtension.configure({
          proofreader: this,
          uiStrings: {
            noSuggestions: this.translateService.instant('spellchecker.no_suggestion'),
          },
          onShowSuggestionsEvent: this.updateSuggestionBox.bind(this)
        })
      ],
    });
  }

  closeSuggestionNotification() {
    this.sentSuggestion = false;
  }

  openManual(manualType: ManualType, language: string, hunspellLanguage: HunspellLanguage) {
    this.modalService.addModal(ManualsSpellcheckerComponent, { manualType: manualType, language: language, hunspellLanguage: hunspellLanguage}).subscribe();
  }

  // from IProofreaderInterface
  proofreadText(sentence: string): Promise<ITextWithPosition[]> {
    if (!this.proofreader) {
      return Promise.resolve([]);
    }
    return this.proofreader.proofreadText(sentence);
  }

  // IProofreaderInterface
  getSuggestions(word: string): Promise<string[]> {
    if (!this.proofreader) {
      return Promise.resolve([]);
    }
    return this.proofreader.getSuggestions(word);
  }

  // IProofreaderInterface
  normalizeTextForLanguage(text: string): string {
    return text.split('’').join("'");
  }

  private async loadProofreader() {
    switch (this.idiom) {
      case 'puter':
        this.proofreader = await Proofreader.Proofreader.CreateProofreader('rm-puter');
        break;
      case 'rumgr':
        this.proofreader = await Proofreader.Proofreader.CreateProofreader('rm-rumgr');
        break;
      case 'surmiran':
        this.proofreader = await Proofreader.Proofreader.CreateProofreader('rm-surmiran');
        break;
      case 'sutsilv':
        this.proofreader = await Proofreader.Proofreader.CreateProofreader('rm-sutsilv');
        break;
      case 'vallader':
        this.proofreader = await Proofreader.Proofreader.CreateProofreader('rm-vallader');
        break;
      default:
        return;
    }

    this.onDictLoaded();
  }

  private async loadTestingFile() {
    const test = await fetch(`assets/hunspell/tests/rm-${this.idiom}-test.html`);
    this.value = await test.text();
  }

  private updateSuggestionBox(word: string) {
    const suggestionText = document.createElement('span');
    suggestionText.className = 'suggestion-text';
    suggestionText.innerText = this.translateService.instant('spellchecker.send_suggestion');

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
}
