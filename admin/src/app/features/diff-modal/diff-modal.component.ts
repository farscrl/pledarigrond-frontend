import { Component, Inject } from '@angular/core';
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { Language } from "../../models/security";
import { LanguageSelectionService } from "../../services/language-selection.service";
import { EntryVersionInternalDto } from '../../models/dictionary';

export class DiffModalData {
  original: EntryVersionInternalDto = new EntryVersionInternalDto();
  change: EntryVersionInternalDto = new EntryVersionInternalDto();
}

@Component({
    selector: 'app-diff-modal',
    templateUrl: './diff-modal.component.html',
    styleUrls: ['./diff-modal.component.scss'],
    standalone: false
})
export class DiffModalComponent {
  language: Language = Language.RUMANTSCHGRISCHUN;
  originalVersion: EntryVersionInternalDto;
  changedVersion: EntryVersionInternalDto;

  constructor(
    languageSelectionService: LanguageSelectionService,
    @Inject(NZ_MODAL_DATA) data: DiffModalData
  ) {
    this.originalVersion = data.original || new EntryVersionInternalDto();
    this.changedVersion = data.change || new EntryVersionInternalDto();
    this.language = languageSelectionService.getCurrentLanguage();

    // set default version values if not set
    this.originalVersion.inflection = this.originalVersion.inflection || {};
    this.originalVersion.inflection.verb = this.originalVersion.inflection.verb || {};
    this.originalVersion.inflection.verb.preschent = this.originalVersion.inflection.verb.preschent || {};
    this.originalVersion.inflection.verb.imperfect = this.originalVersion.inflection.verb.imperfect || {};
    this.originalVersion.inflection.verb.conjunctiv = this.originalVersion.inflection.verb.conjunctiv || {};
    this.originalVersion.inflection.verb.conjunctiv2 = this.originalVersion.inflection.verb.conjunctiv2 || {};
    this.originalVersion.inflection.verb.cundiziunal = this.originalVersion.inflection.verb.cundiziunal || {};
    this.originalVersion.inflection.verb.cundiziunalIndirect = this.originalVersion.inflection.verb.cundiziunalIndirect || {};
    this.originalVersion.inflection.verb.futur = this.originalVersion.inflection.verb.futur || {};
    this.originalVersion.inflection.verb.futurDubitativ = this.originalVersion.inflection.verb.futurDubitativ || {};
    this.originalVersion.inflection.verb.preschentEnclitic = this.originalVersion.inflection.verb.preschentEnclitic || {};
    this.originalVersion.inflection.verb.imperfectEnclitic = this.originalVersion.inflection.verb.imperfectEnclitic || {};
    this.originalVersion.inflection.verb.cundizionalEnclitic = this.originalVersion.inflection.verb.cundizionalEnclitic || {};
    this.originalVersion.inflection.verb.futurEnclitic = this.originalVersion.inflection.verb.futurEnclitic || {};
    this.originalVersion.inflection.verb.futurDubitativEnclitic = this.originalVersion.inflection.verb.futurDubitativEnclitic || {};
    this.originalVersion.inflection.noun = this.originalVersion.inflection.noun || {};
    this.originalVersion.inflection.adjective = this.originalVersion.inflection.adjective || {};
    this.originalVersion.inflection.pronoun = this.originalVersion.inflection.pronoun || {};
    this.originalVersion.inflection.other = this.originalVersion.inflection.other || {};

    this.changedVersion.inflection = this.changedVersion.inflection || {};
    this.changedVersion.inflection.verb = this.changedVersion.inflection.verb || {};
    this.changedVersion.inflection.verb.preschent = this.changedVersion.inflection.verb.preschent || {};
    this.changedVersion.inflection.verb.imperfect = this.changedVersion.inflection.verb.imperfect || {};
    this.changedVersion.inflection.verb.conjunctiv = this.changedVersion.inflection.verb.conjunctiv || {};
    this.changedVersion.inflection.verb.conjunctiv2 = this.changedVersion.inflection.verb.conjunctiv2 || {};
    this.changedVersion.inflection.verb.cundiziunal = this.changedVersion.inflection.verb.cundiziunal || {};
    this.changedVersion.inflection.verb.cundiziunalIndirect = this.changedVersion.inflection.verb.cundiziunalIndirect || {};
    this.changedVersion.inflection.verb.futur = this.changedVersion.inflection.verb.futur || {};
    this.changedVersion.inflection.verb.futurDubitativ = this.changedVersion.inflection.verb.futurDubitativ || {};
    this.changedVersion.inflection.verb.preschentEnclitic = this.changedVersion.inflection.verb.preschentEnclitic || {};
    this.changedVersion.inflection.verb.imperfectEnclitic = this.changedVersion.inflection.verb.imperfectEnclitic || {};
    this.changedVersion.inflection.verb.cundizionalEnclitic = this.changedVersion.inflection.verb.cundizionalEnclitic || {};
    this.changedVersion.inflection.verb.futurEnclitic = this.changedVersion.inflection.verb.futurEnclitic || {};
    this.changedVersion.inflection.verb.futurDubitativEnclitic = this.changedVersion.inflection.verb.futurDubitativEnclitic || {};
    this.changedVersion.inflection.noun = this.changedVersion.inflection.noun || {};
    this.changedVersion.inflection.adjective = this.changedVersion.inflection.adjective || {};
    this.changedVersion.inflection.pronoun = this.changedVersion.inflection.pronoun || {};
    this.changedVersion.inflection.other = this.changedVersion.inflection.other || {};
  }
}
