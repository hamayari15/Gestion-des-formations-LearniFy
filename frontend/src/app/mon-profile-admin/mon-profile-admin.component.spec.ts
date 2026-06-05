import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonProfileAdminComponent } from './mon-profile-admin.component';

describe('MonProfileAdminComponent', () => {
  let component: MonProfileAdminComponent;
  let fixture: ComponentFixture<MonProfileAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonProfileAdminComponent]
    });
    fixture = TestBed.createComponent(MonProfileAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
