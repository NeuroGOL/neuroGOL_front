import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsByPlayerComponent } from './reports-by-player.component';

describe('ReportsByPlayerComponent', () => {
  let component: ReportsByPlayerComponent;
  let fixture: ComponentFixture<ReportsByPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsByPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsByPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
