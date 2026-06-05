import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonProfileParticipantComponent } from './mon-profile-participant.component';

describe('MonProfileParticipantComponent', () => {
  let component: MonProfileParticipantComponent;
  let fixture: ComponentFixture<MonProfileParticipantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonProfileParticipantComponent]
    });
    fixture = TestBed.createComponent(MonProfileParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
