import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabledatadisplayComponent } from './tabledatadisplay.component';

describe('TabledatadisplayComponent', () => {
  let component: TabledatadisplayComponent;
  let fixture: ComponentFixture<TabledatadisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabledatadisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabledatadisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
