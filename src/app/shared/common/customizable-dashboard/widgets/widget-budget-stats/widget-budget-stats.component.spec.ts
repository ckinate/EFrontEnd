import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBudgetStatsComponent } from './widget-budget-stats.component';

describe('WidgetBudgetStatsComponent', () => {
  let component: WidgetBudgetStatsComponent;
  let fixture: ComponentFixture<WidgetBudgetStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetBudgetStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBudgetStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
