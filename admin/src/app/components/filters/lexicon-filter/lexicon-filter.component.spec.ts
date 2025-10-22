import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexiconFilterComponent } from './lexicon-filter.component';

describe('LexiconFilterComponent', () => {
  let component: LexiconFilterComponent;
  let fixture: ComponentFixture<LexiconFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LexiconFilterComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexiconFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
