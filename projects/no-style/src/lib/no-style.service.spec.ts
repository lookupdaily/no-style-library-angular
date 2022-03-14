import { TestBed } from '@angular/core/testing';

import { NoStyleService } from './no-style.service';

describe('NoStyleService', () => {
  let service: NoStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
