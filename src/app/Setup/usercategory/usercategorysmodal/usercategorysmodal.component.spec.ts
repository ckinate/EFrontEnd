import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercategorysmodalComponent } from './usercategorysmodal.component';

describe('UsercategorysmodalComponent', () => {
  let component: UsercategorysmodalComponent;
  let fixture: ComponentFixture<UsercategorysmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercategorysmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercategorysmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
