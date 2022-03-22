import { TestBed } from '@angular/core/testing';

import { SelectedLanguageService } from './selected-language.service';

describe('SelectedLanguageService', () => {
  let service: SelectedLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
