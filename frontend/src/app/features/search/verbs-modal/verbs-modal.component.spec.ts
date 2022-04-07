import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbsModalComponent } from './verbs-modal.component';

describe('VerbsModalComponent', () => {
  let component: VerbsModalComponent;
  let fixture: ComponentFixture<VerbsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerbsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
