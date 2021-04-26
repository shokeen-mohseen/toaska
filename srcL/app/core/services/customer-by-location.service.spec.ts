import { TestBed } from '@angular/core/testing';

import { CustomerByLocationService } from './customer-by-location.service';

describe('CustomerByLocationService', () => {
  let service: CustomerByLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerByLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
