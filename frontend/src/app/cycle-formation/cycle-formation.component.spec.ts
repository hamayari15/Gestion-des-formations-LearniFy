import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleFormationComponent } from './cycle-formation.component';

describe('CycleFormationComponent', () => {
  let component: CycleFormationComponent;
  let fixture: ComponentFixture<CycleFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CycleFormationComponent]
    });
    fixture = TestBed.createComponent(CycleFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
