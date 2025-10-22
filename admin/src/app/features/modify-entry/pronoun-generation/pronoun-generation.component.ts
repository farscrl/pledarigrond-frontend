import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { EnvironmentService } from "../../../services/environment.service";
import { EntryVersionInternalDto, Pronoun } from '../../../models/dictionary';
import { NgIf } from '@angular/common';
import { PronunciationCharactersComponent } from '../../../components/pronunciation-characters/pronunciation-characters.component';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { TranslatePipe } from '@ngx-translate/core';

export class PronounGenerationData {
  version?: EntryVersionInternalDto;
}
@Component({
    selector: 'app-pronoun-generation',
    templateUrl: './pronoun-generation.component.html',
    styleUrls: ['./pronoun-generation.component.scss'],
    imports: [NgIf, PronunciationCharactersComponent, FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzInputDirective, NzAutosizeDirective, NzModalFooterDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, TranslatePipe]
})
export class PronounGenerationComponent implements OnInit {

  private version?: EntryVersionInternalDto;

  validateForm!: UntypedFormGroup;

  working: Pronoun = new Pronoun();

  constructor(
    private fb: UntypedFormBuilder,
    private modal: NzModalRef,
    public environmentService: EnvironmentService,
    @Inject(NZ_MODAL_DATA) data: PronounGenerationData,
  ) {
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
