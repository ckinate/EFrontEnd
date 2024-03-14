import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotabledatadisplayComponent } from './notabledatadisplay.component';

describe('NotabledatadisplayComponent', () => {
  let component: NotabledatadisplayComponent;
  let fixture: ComponentFixture<NotabledatadisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotabledatadisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotabledatadisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
