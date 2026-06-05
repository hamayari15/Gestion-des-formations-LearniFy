import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsPresensielComponent } from './formations-presensiel.component';

describe('FormationsPresensielComponent', () => {
  let component: FormationsPresensielComponent;
  let fixture: ComponentFixture<FormationsPresensielComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationsPresensielComponent]
    });
    fixture = TestBed.createComponent(FormationsPresensielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
