import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditBankglmapComponent } from './create-or-edit-bankglmap.component';

describe('CreateOrEditBankglmapComponent', () => {
  let component: CreateOrEditBankglmapComponent;
  let fixture: ComponentFixture<CreateOrEditBankglmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditBankglmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditBankglmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
