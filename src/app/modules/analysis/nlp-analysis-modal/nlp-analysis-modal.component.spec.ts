import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NlpAnalysisModalComponent } from './nlp-analysis-modal.component';

describe('NlpAnalysisModalComponent', () => {
  let component: NlpAnalysisModalComponent;
  let fixture: ComponentFixture<NlpAnalysisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NlpAnalysisModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NlpAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
