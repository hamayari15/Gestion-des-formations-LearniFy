import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInscritsComponent } from './liste-inscrits.component';

describe('ListeInscritsComponent', () => {
  let component: ListeInscritsComponent;
  let fixture: ComponentFixture<ListeInscritsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeInscritsComponent]
    });
    fixture = TestBed.createComponent(ListeInscritsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
