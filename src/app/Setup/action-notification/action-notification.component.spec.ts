import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionNotificationComponent } from './action-notification.component';

describe('ActionNotificationComponent', () => {
  let component: ActionNotificationComponent;
  let fixture: ComponentFixture<ActionNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
