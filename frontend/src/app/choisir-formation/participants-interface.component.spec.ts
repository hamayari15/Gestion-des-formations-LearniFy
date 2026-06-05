import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsInterfaceComponent } from './choisir-formation.component';

describe('ParticipantsInterfaceComponent', () => {
  let component: ParticipantsInterfaceComponent;
  let fixture: ComponentFixture<ParticipantsInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantsInterfaceComponent]
    });
    fixture = TestBed.createComponent(ParticipantsInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
