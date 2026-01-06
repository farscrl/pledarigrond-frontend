import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective, NzModalRef } from 'ng-zorro-antd/modal';
import { EnvironmentService } from "../../../services/environment.service";
import { EntryVersionInternalDto, Pronoun } from '../../../models/dictionary';

import {
  PronunciationCharactersComponent
} from '../../../components/pronunciation-characters/pronunciation-characters.component';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzAutosizeDirective, NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { TranslatePipe } from '@ngx-translate/core';

export class PronounGenerationData {
  version?: EntryVersionInternalDto;
}
@Component({
    selector: 'app-pronoun-generation',
    templateUrl: './pronoun-generation.component.html',
    styleUrls: ['./pronoun-generation.component.scss'],
    imports: [PronunciationCharactersComponent, FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzInputDirective, NzAutosizeDirective, NzModalFooterDirective, NzButtonComponent, NzWaveDirective, TranslatePipe]
})
export class PronounGenerationComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private modal = inject(NzModalRef);
  environmentService = inject(EnvironmentService);


  private version?: EntryVersionInternalDto;

  validateForm!: UntypedFormGroup;

  working: Pronoun = new Pronoun();

  constructor() {
    const data = inject<PronounGenerationData>(NZ_MODAL_DATA);

    this.version = data.version;
    if (this.version) {
      this.working = JSON.parse(JSON.stringify(this.version.inflection?.pronoun || new Pronoun()));
    }
  }

  ngOnInit(): void {
    this.setUpForm();
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.working = JSON.parse(JSON.stringify(this.version!.inflection?.pronoun || new Pronoun()));
    this.setUpForm();
  }

  ok() {
    if (this.validateForm.valid) {
      this.returnValues();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private returnValues() {
    this.working.baseForm = this.validateForm.get('baseForm')?.value;

    this.working.mSingular = this.validateForm.get('mSingular')?.value;
    this.working.fSingular = this.validateForm.get('fSingular')?.value;
    this.working.mPlural = this.validateForm.get('mPlural')?.value;
    this.working.fPlural = this.validateForm.get('fPlural')?.value;

    this.modal.close(this.working);
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      baseForm: new UntypedFormControl(this.working.baseForm),

      mSingular: new UntypedFormControl(this.working.mSingular),
      fSingular: new UntypedFormControl(this.working.fSingular),
      mPlural: new UntypedFormControl(this.working.mPlural),
      fPlural: new UntypedFormControl(this.working.fPlural),
    });

    setTimeout(() => {
      this.triggerChangeDetectionForAutoSize();
    }, 150);
  }

  private triggerChangeDetectionForAutoSize() {
    // the autoresize check can't be triggered manually. But it reacts to resize events of the window.
    // thus, we dispatch that event to force autoresize to be triggered.
    window.dispatchEvent(new Event('resize'));
  }
}
