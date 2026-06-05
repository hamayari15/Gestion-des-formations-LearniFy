import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeParticipantsComponent } from './liste-participants.component';

describe('ListeParticipantsComponent', () => {
  let component: ListeParticipantsComponent;
  let fixture: ComponentFixture<ListeParticipantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeParticipantsComponent]
    });
    fixture = TestBed.createComponent(ListeParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
