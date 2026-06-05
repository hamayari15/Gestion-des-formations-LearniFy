import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFormationsComponent } from './liste-formations.component';

describe('ListeFormationsComponent', () => {
  let component: ListeFormationsComponent;
  let fixture: ComponentFixture<ListeFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeFormationsComponent]
    });
    fixture = TestBed.createComponent(ListeFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
