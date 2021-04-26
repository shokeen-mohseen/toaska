import { TestBed } from '@angular/core/testing';

import { ShowNotesService } from './show-notes.service';

describe('ShowNotesService', () => {
  let service: ShowNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
