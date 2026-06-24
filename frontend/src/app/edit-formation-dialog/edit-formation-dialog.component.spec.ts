import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormationDialogComponent } from './edit-formation-dialog.component';

describe('EditFormationDialogComponent', () => {
  let component: EditFormationDialogComponent;
  let fixture: ComponentFixture<EditFormationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFormationDialogComponent]
    });
    fixture = TestBed.createComponent(EditFormationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
