import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LemmaVersion } from 'src/app/models/lemma-version';
import { LexEntry } from 'src/app/models/lex-entry';
import { EditorService } from 'src/app/services/editor.service';
import { LanguageSelectionService } from 'src/app/services/language-selection.service';

@Component({
  selector: 'app-main-entry',
  templateUrl: './main-entry.component.html',
  styleUrls: ['./main-entry.component.scss']
})
export class MainEntryComponent implements OnInit {

  @Input()
  lexEntryId?: string;

  isLoading = false;

  private lexEntry?: LexEntry;
  private lemmaVersion?: LemmaVersion;

  validateForm!: FormGroup;

  constructor(private modal: NzModalRef, private fb: FormBuilder, private editorService: EditorService, private languageSelectionService: LanguageSelectionService) { }

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
        this.lemmaVersion = JSON.parse(JSON.stringify(entry.current));
        this.setUpForm();
      });
    }
  }

  save() {
    if (this.validateForm.valid) {
      if (!!this.lexEntryId) {
        this.updateEntry();
      } else {
        this.saveNewEntry();
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


  private setUpForm() {
    this.validateForm = this.fb.group({
      DStichwort: new FormControl(this.lemmaVersion?.lemmaValues.DStichwort, Validators.required),
      DGrammatik: new FormControl(this.lemmaVersion?.lemmaValues.DGrammatik),
      DSubsemantik: new FormControl(this.lemmaVersion?.lemmaValues.DSubsemantik),
      DGenus: new FormControl(this.lemmaVersion?.lemmaValues.DGenus),

      RStichwort: new FormControl(this.lemmaVersion?.lemmaValues.RStichwort, Validators.required),
      RGrammatik: new FormControl(this.lemmaVersion?.lemmaValues.RGrammatik),
      RSubsemantik: new FormControl(this.lemmaVersion?.lemmaValues.RSubsemantik),
      RGenus: new FormControl(this.lemmaVersion?.lemmaValues.RGenus),
      RFlex: new FormControl(this.lemmaVersion?.lemmaValues.RFlex),
      RTags: new FormControl(this.lemmaVersion?.lemmaValues.RTags),
      RInflectionType: new FormControl(this.lemmaVersion?.lemmaValues.RInflectionType),

      redirect_a: new FormControl(this.lemmaVersion?.lemmaValues.redirect_a),
      redirect_b: new FormControl(this.lemmaVersion?.lemmaValues.redirect_b),
      categories: new FormControl(this.lemmaVersion?.lemmaValues.categories),

      user_comment: new FormControl(this.lemmaVersion?.lemmaValues.user_comment),
      user_email: new FormControl(this.lemmaVersion?.lemmaValues.user_email),
    });
  }

  private saveNewEntry() {
    console.log('submit', this.validateForm.value);
    const lexEntry = new LexEntry();
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lemmaValues = JSON.parse(JSON.stringify(this.validateForm.value));
    lexEntry.versionHistory.push(lemmaVersion);
    lexEntry.current = lemmaVersion;
    lexEntry.mostRecent = lemmaVersion;
    this.editorService.newLexEntry(this.languageSelectionService.getCurrentLanguage(), lexEntry).subscribe(data => {
      this.cancel();
      this.modal.triggerOk();
    }, error => {
      console.error(error);
    });
  }

  private updateEntry() {
    const lemmaVersion = new LemmaVersion();
    lemmaVersion.lemmaValues = JSON.parse(JSON.stringify(this.validateForm.value));
    this.editorService.modifyAndAccepptLexEntry(this.languageSelectionService.getCurrentLanguage(), this.lexEntry!.id!, lemmaVersion).subscribe(data => {
      this.cancel();
      this.modal.triggerOk();
    }, error => {
      console.error(error);
    });
  }
}
