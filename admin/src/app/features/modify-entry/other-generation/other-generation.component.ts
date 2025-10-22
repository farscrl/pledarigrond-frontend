import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { EnvironmentService } from '../../../services/environment.service';
import { EntryVersionInternalDto, Other, Pronoun } from '../../../models/dictionary';

import { PronunciationCharactersComponent } from '../../../components/pronunciation-characters/pronunciation-characters.component';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { TranslatePipe } from '@ngx-translate/core';

export class OtherGenerationData {
  version?: EntryVersionInternalDto;
}

@Component({
    selector: 'app-other-generation',
    templateUrl: './other-generation.component.html',
    styleUrls: ['./other-generation.component.scss'],
    imports: [PronunciationCharactersComponent, FormsModule, NzFormDirective, ReactiveFormsModule, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzInputDirective, NzModalFooterDirective, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, TranslatePipe]
})
export class OtherGenerationComponent implements OnInit{
  private fb = inject(UntypedFormBuilder);
  private modal = inject(NzModalRef);
  environmentService = inject(EnvironmentService);


  private version?: EntryVersionInternalDto;

  validateForm!: UntypedFormGroup;

  working: Other = new Other();

  constructor() {
    const data = inject<OtherGenerationData>(NZ_MODAL_DATA);

    this.version = data.version;
    if (this.version) {
      this.working = JSON.parse(JSON.stringify(this.version.inflection?.other || new Pronoun()));
    }
  }

  ngOnInit(): void {
    this.setUpForm();
  }

  cancel() {
    this.modal.close();
  }

  reset() {
    this.working = JSON.parse(JSON.stringify(this.version!.inflection?.other || new Pronoun()));
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

    this.working.otherForm1 = this.validateForm.get('otherForm1')?.value;
    this.working.otherForm2 = this.validateForm.get('otherForm2')?.value;
    this.working.otherForm3 = this.validateForm.get('otherForm3')?.value;
    this.working.otherForm4 = this.validateForm.get('otherForm4')?.value;

    this.modal.close(this.validateForm.getRawValue());
  }

  private setUpForm() {
    this.validateForm = this.fb.group({
      baseForm: new UntypedFormControl(this.working.baseForm),

      otherForm1: new UntypedFormControl(this.working.otherForm1),
      otherForm2: new UntypedFormControl(this.working.otherForm2),
      otherForm3: new UntypedFormControl(this.working.otherForm3),
      otherForm4: new UntypedFormControl(this.working.otherForm4),
    });
  }
}
