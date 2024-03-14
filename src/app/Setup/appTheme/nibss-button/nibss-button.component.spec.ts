import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NibssButtonComponent } from './nibss-button.component';

describe('NibssButtonComponent', () => {
  let component: NibssButtonComponent;
  let fixture: ComponentFixture<NibssButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NibssButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NibssButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
