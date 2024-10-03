import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCorpusEntryComponent } from './find-corpus-entry.component';

describe('FindCorpusEntryComponent', () => {
  let component: FindCorpusEntryComponent;
  let fixture: ComponentFixture<FindCorpusEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindCorpusEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCorpusEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
