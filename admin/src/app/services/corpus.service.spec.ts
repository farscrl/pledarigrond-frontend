import { TestBed } from '@angular/core/testing';

import { CorpusService } from './corpus.service';

describe('CorpusService', () => {
  let service: CorpusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorpusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
