import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTimelineComponent } from './reports-timeline.component';

describe('ReportsTimelineComponent', () => {
  let component: ReportsTimelineComponent;
  let fixture: ComponentFixture<ReportsTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
