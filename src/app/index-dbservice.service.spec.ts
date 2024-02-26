import { TestBed } from '@angular/core/testing';

import { IndexDBServiceService } from './indexDBservice.service';

describe('IndexDBServiceService', () => {
  let service: IndexDBServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexDBServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
