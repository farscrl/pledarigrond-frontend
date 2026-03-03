import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestWordSpellchecker } from './suggest-word-spellchecker';

describe('SuggestWordSpellchecker', () => {
  let component: SuggestWordSpellchecker;
  let fixture: ComponentFixture<SuggestWordSpellchecker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestWordSpellchecker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestWordSpellchecker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
