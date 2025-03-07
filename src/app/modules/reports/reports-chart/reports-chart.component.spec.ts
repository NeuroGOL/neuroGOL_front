import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsChartComponent } from './reports-chart.component';

describe('ReportsChartComponent', () => {
  let component: ReportsChartComponent;
  let fixture: ComponentFixture<ReportsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
