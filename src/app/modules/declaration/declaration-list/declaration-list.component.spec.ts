import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationListComponent } from './declaration-list.component';

describe('DeclarationListComponent', () => {
  let component: DeclarationListComponent;
  let fixture: ComponentFixture<DeclarationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
