import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantInterfaceComponent } from './participant-interface.component';

describe('ParticipantInterfaceComponent', () => {
  let component: ParticipantInterfaceComponent;
  let fixture: ComponentFixture<ParticipantInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantInterfaceComponent]
    });
    fixture = TestBed.createComponent(ParticipantInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
