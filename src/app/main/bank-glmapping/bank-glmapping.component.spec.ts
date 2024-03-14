import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGlmappingComponent } from './bank-glmapping.component';

describe('BankGlmappingComponent', () => {
  let component: BankGlmappingComponent;
  let fixture: ComponentFixture<BankGlmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankGlmappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGlmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
