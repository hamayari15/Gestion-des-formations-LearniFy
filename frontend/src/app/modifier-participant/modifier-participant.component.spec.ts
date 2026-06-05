import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierParticipantComponent } from './modifier-participant.component';

describe('ModifierParticipantComponent', () => {
  let component: ModifierParticipantComponent;
  let fixture: ComponentFixture<ModifierParticipantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierParticipantComponent]
    });
    fixture = TestBed.createComponent(ModifierParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
