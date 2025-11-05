import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSummaryComponent } from './reports-summary.component';

describe('ReportsSummaryComponent', () => {
  let component: ReportsSummaryComponent;
  let fixture: ComponentFixture<ReportsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
