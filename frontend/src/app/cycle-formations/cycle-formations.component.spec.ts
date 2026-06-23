import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleFormationsComponent } from './cycle-formations.component';

describe('CycleFormationsComponent', () => {
  let component: CycleFormationsComponent;
  let fixture: ComponentFixture<CycleFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CycleFormationsComponent]
    });
    fixture = TestBed.createComponent(CycleFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
