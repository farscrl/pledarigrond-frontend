import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexiconComponent } from './lexicon.component';

describe('LexiconComponent', () => {
  let component: LexiconComponent;
  let fixture: ComponentFixture<LexiconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LexiconComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexiconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
