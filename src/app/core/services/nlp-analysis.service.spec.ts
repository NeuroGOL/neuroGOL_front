import { TestBed } from '@angular/core/testing';

import { NlpAnalysisService } from './nlp-analysis.service';

describe('NlpAnalysisService', () => {
  let service: NlpAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NlpAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
