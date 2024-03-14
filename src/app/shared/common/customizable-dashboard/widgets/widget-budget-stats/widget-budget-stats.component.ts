import { Component, Injector, OnInit } from '@angular/core';
import { CalculateSpiltCostBudgetDto, OperatingExpenseServiceServiceProxy, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { Console } from 'console';
import { finalize } from 'rxjs/operators';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';


class DashboardTopStats extends DashboardChartBase {



  totalBudget = 0; totalBudgetCounter = 0;
  usedBudget = 0; usedBudgetCounter = 0;
  inUseBudget = 0; inUseBudgetCounter = 0;
  availableBudget = 0; availableBudgetCounter = 0;

  totalBudgetChange = 0; totalBudgetChangeCounter = 0;
  usedBudgetChange = 0; usedBudgetChangeCounter = 0;
  inUseBudgetChange = 0; inUseBudgetChangeCounter = 0;
  availableBudgetChange = 0; availableBudgetChangeCounter = 0;

  init(totalBudget, usedBudget, inUseBudget, availableBudget) {
    this.totalBudget = totalBudget;
    this.usedBudget = usedBudget;
    this.inUseBudget = inUseBudget;
    this.availableBudget = availableBudget;
this.usedBudgetChange = ((this.usedBudget)/totalBudget) * 100;
this.inUseBudgetChange = ((this.inUseBudget)/totalBudget) * 100;
this.availableBudgetChange = ((this.availableBudget)/totalBudget) * 100;

console.log(this.usedBudgetChange);
console.log(totalBudget);
console.log(this.availableBudget);
console.log(this.inUseBudget);


    this.hideLoading();
  }
}
@Component({
  selector: 'app-widget-budget-stats',
  templateUrl: './widget-budget-stats.component.html',
  styleUrls: ['./widget-budget-stats.component.css']
})
export class WidgetBudgetStatsComponent extends  WidgetComponentBaseComponent implements OnInit {

  dashboardTopStats: DashboardTopStats;
  expenseLoading = false;
  UserMIS = "";
 

  constructor(injector: Injector,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy,
    private _opex: OperatingExpenseServiceServiceProxy
  ) {
    super(injector);
    this.dashboardTopStats = new DashboardTopStats();
  }

  ngOnInit() {
    debugger;
    this.loadStatsData();
    
  }

  loadStatsData() {
this.primengTableHelper.isLoading = false;
    this._opex.checkLoginUserMISBudget()
    .pipe(
      finalize(() => {
        this.primengTableHelper.isLoading = false;
      })
      ).subscribe((data) => {
      this.dashboardTopStats.init(data.budgetTotalAmount, data.budgetUsedAmount , data.budgetInUse, data.availableBudgetAmount);

  });

  }


}
