import { TestBed } from '@angular/core/testing';

import { Registration } from './registration';

describe('Registration', () => {
  let service: Registration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Registration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
