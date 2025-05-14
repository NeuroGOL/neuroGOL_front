import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisNplModalComponent } from './analysis-npl-modal.component';

describe('AnalysisNplModalComponent', () => {
  let component: AnalysisNplModalComponent;
  let fixture: ComponentFixture<AnalysisNplModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisNplModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisNplModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
