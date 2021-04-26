/*
Developer Name: Vinay Kumar
File Created By: Vinay Kumar
Date: Aug 29, 2020
TFS ID: 17214
Logic Description: added useraccess.service
Start Code
*/
import { TestBed } from '@angular/core/testing';

import { UseraccessService } from './useraccess.service';

describe('UseraccessService', () => {
  let service: UseraccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UseraccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
/*TFS ID: 17214
 End Code*/
