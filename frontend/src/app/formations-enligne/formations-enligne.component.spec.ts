import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsEnligneComponent } from './formations-enligne.component';

describe('FormationsEnligneComponent', () => {
  let component: FormationsEnligneComponent;
  let fixture: ComponentFixture<FormationsEnligneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationsEnligneComponent]
    });
    fixture = TestBed.createComponent(FormationsEnligneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
