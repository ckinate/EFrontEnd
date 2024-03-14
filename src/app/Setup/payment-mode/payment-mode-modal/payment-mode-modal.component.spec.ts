import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeModalComponent } from './payment-mode-modal.component';

describe('PaymentModeModalComponent', () => {
  let component: PaymentModeModalComponent;
  let fixture: ComponentFixture<PaymentModeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentModeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
