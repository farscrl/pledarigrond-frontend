import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConjugationComponent } from '../conjugation/conjugation.component';
import { TranslateService } from '@ngx-translate/core';
import { NounGenerationComponent } from '../noun-generation/noun-generation.component';

@Component({
  selector: 'app-main-entry',
  templateUrl: './main-entry.component.html',
  styleUrls: ['./main-entry.component.scss']
})
export class MainEntryComponent implements OnInit {

  @Input()
  lexEntryId?: string;

  isLoading = false;

  dGrammatikValues: string[] = [];
  dGenusValues: string[] = [];
  rGrammatikValues: string[] = [];
  rGenusValues: string[] = [];

  private lexEntry?: LexEntry;
  private lemmaVersion?: LemmaVersion;

  validateForm!: FormGroup;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private editorService: EditorService,
    private languageSelectionService: LanguageSelectionService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.reset()
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.lemmaVersion = new LemmaVersion();
    this.setUpForm();

    if (this.lexEntryId) {
      this.editorService.getLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntryId).subscribe(entry => {
        this.lexEntry = entry;
        this.lemmaVersion = JSON.parse(JSON.stringify(entry.mostRecent));
        this.setUpForm();
      });
    }
  }

  save(asSuggestion: boolean) {
    if (this.validateForm.valid) {
      if (!!this.lexEntryId) {
        this.updateEntry(asSuggestion);
      } else {
        this.saveNewEntry(asSuggestion);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editVerb() {
    if (!this.lemmaVersion?.lemmaValues.infinitiv) {
      this.lemmaVersion!.lemmaValues.infinitiv = this.validateForm.controls['RStichwort'].value;
    }
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.conjugation.title'),
      nzContent: ConjugationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    })
  }

  editNoun() {
    this.lemmaVersion!.lemmaValues.RStichwort = this.validateForm.controls['RStichwort'].value;
    this.lemmaVersion!.lemmaValues.RGenus = this.validateForm.controls['RGenus'].value;
    this.lemmaVersion!.lemmaValues.RFlex = this.validateForm.controls['RFlex'].value;

    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('edit.noun.title'),
      nzContent: NounGenerationComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 1100,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        lemmaVersion: this.lemmaVersion,
      },
    });
    modal.afterClose.subscribe(value => {
      if (value === undefined) {
        return;
      }
      this.lemmaVersion!.lemmaValues = {
        ...this.lemmaVersion?.lemmaValues,
        ...value
      };
    })
  }

  private setUpForm() {
    this.setupDropdownValues();

    this.validateForm = this.fb.group({
      DStichwort: new FormControl(this.lemmaVersion?.lemmaValues.DStichwort, Validators.required),
      DGrammatik: new FormControl(this.lemmaVersion?.lemmaValues.DGrammatik),
      DSubsemantik: new FormControl(this.lemmaVersion?.lemmaValues.DSubsemantik),
      DGenus: new FormControl(this.lemmaVersion?.lemmaValues.DGenus),
      DTags: new FormControl(this.lemmaVersion?.lemmaValues.DTags),

      RStichwort: new FormControl(this.lemmaVersion?.lemmaValues.RStichwort, Validators.required),
      RGrammatik: new FormControl(this.lemmaVersion?.lemmaValues.RGrammatik),
      RSubsemantik: new FormControl(this.lemmaVersion?.lemmaValues.RSubsemantik),
      RGenus: new FormControl(this.lemmaVersion?.lemmaValues.RGenus),
      RFlex: new FormControl(this.lemmaVersion?.lemmaValues.RFlex),
      RTags: new FormControl(this.lemmaVersion?.lemmaValues.RTags),
      RInflectionType: new FormControl(this.lemmaVersion?.lemmaValues.RInflectionType),

      DRedirect: new FormControl(this.lemmaVersion?.lemmaValues.DRedirect),
      RRedirect: new FormControl(this.lemmaVersion?.lemmaValues.RRedirect),
      categories: new FormControl(this.lemmaVersion?.lemmaValues.categories),

      contact_comment: new FormControl(this.lemmaVersion?.lemmaValues.contact_comment),
      contact_email: new FormControl(this.lemmaVersion?.lemmaValues.contact_email),
    });
  }

  private setupDropdownValues() {
    this.dGenusValues = this.getDGenusValues();
    if (this.lemmaVersion?.lemmaValues.DGenus && !this.dGenusValues.includes(this.lemmaVersion?.lemmaValues.DGenus)) {
      this.dGenusValues.push(this.lemmaVersion?.lemmaValues.DGenus);
    }

    this.dGrammatikValues = this.getDGrammatikValues();
    if (this.lemmaVersion?.lemmaValues.DGrammatik && !this.dGenusValues.includes(this.lemmaVersion?.lemmaValues.DGrammatik)) {
      this.dGrammatikValues.push(this.lemmaVersion?.lemmaValues.DGrammatik);
    }

    this.rGenusValues = this.getRGenusValues();
    if (this.lemmaVersion?.lemmaValues.RGenus && !this.dGenusValues.includes(this.lemmaVersion?.lemmaValues.RGenus)) {
      this.rGenusValues.push(this.lemmaVersion?.lemmaValues.RGenus);
    }

    this.rGrammatikValues = this.getRGrammatikValues();
    if (this.lemmaVersion?.lemmaValues.RGrammatik && !this.dGenusValues.includes(this.lemmaVersion?.lemmaValues.RGrammatik)) {
      this.rGrammatikValues.push(this.lemmaVersion?.lemmaValues.RGrammatik);
    }
  }

  private saveNewEntry(asSuggestion: boolean) {
    const lexEntry = new LexEntry();
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lemmaValues = {
      ...this.lemmaVersion?.lemmaValues,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    lexEntry.versionHistory.push(lemmaVersion);
    lexEntry.current = lemmaVersion;
    lexEntry.mostRecent = lemmaVersion;

    this.editorService.newLexEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry, asSuggestion).subscribe(data => {
      this.cancel();
      this.modal.triggerOk();
    }, error => {
      console.error(error);
    });
  }

  private updateEntry(asSuggestion: boolean) {
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lemmaValues = {
      ...this.lemmaVersion?.lemmaValues,
      ...JSON.parse(JSON.stringify(this.validateForm.value)),
    };
    if (asSuggestion) {
      this.editorService.modifyLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntry!.id!, lemmaVersion).subscribe(data => {
        this.cancel();
        this.modal.triggerOk();
      }, error => {
        console.error(error);
      });
    } else {
      this.editorService.modifyAndAccepptLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntry!.id!, lemmaVersion).subscribe(data => {
        this.cancel();
        this.modal.triggerOk();
      }, error => {
        console.error(error);
      });
    }
  }

  private getDGenusValues(): string[] {
    return ["f", "f(n)", "f(pl)", "f,m", "f,m,n", "f,n", "m", "m(f)", "m(pl)", "m,f", "m,n", "m/n", "n", "n(f)", "n(pl)", "n,f", "n,m", "pl"];
  }

  private getDGrammatikValues(): string[] {
    return ["adj", "adv", "art", "cj", "cumpos", "int", "interj", "inv", "n.l", "n.p", "num", "prep", "pron", "refl", "subst", "tr", "tr/int"];
  }

  private getRGenusValues(): string[] {
    return ["(coll)m", "(f)m", "(m)f", "(pl)f", "coll", "f", "f(pl)", "f.pl", "f/m", "f/m.pl", "m", "m(f)", "m(f)pl", "m(pl)", "m,f", "m.(pl)", "m.pl", "m/f", "m/f.pl", "pl"];
  }

  private getRGrammatikValues(): string[] {
    return ["(refl) tr", "abs/tr", "adj", "adv", "art", "cj", "int", "interj", "inv", "n.l", "n.p", "num", "prep", "pron", "refl", "subst", "tr", "tr/int"];
  }
}
