import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationCharactersComponent } from './pronunciation-characters.component';

describe('PronunciationCharactersComponent', () => {
  let component: PronunciationCharactersComponent;
  let fixture: ComponentFixture<PronunciationCharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PronunciationCharactersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PronunciationCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
