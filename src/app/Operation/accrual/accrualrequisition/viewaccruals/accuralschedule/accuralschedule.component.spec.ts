import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccuralscheduleComponent } from './accuralschedule.component';

describe('AccuralscheduleComponent', () => {
  let component: AccuralscheduleComponent;
  let fixture: ComponentFixture<AccuralscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccuralscheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccuralscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
