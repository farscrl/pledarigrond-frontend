import { TestBed } from '@angular/core/testing';

import { InflectionService } from './inflection.service';

describe('InflectionService', () => {
  let service: InflectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InflectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
