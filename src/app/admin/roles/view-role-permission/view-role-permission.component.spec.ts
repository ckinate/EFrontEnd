import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolePermissionComponent } from './view-role-permission.component';

describe('ViewRolePermissionComponent', () => {
  let component: ViewRolePermissionComponent;
  let fixture: ComponentFixture<ViewRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRolePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
