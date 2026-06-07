import { TestBed } from '@angular/core/testing';

import { IncriptionService } from './incription.service';

describe('IncriptionService', () => {
  let service: IncriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
