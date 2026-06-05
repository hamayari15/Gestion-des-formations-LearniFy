import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesFormationsComponent } from './mes-formations.component';

describe('MesFormationsComponent', () => {
  let component: MesFormationsComponent;
  let fixture: ComponentFixture<MesFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesFormationsComponent]
    });
    fixture = TestBed.createComponent(MesFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
