import { Component, Injector, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { ExpenseTopStatsOutput, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';


class DashboardTopStats extends DashboardChartBase {



 opexAmount = 0; opexAmountCounter = 0; opexCount = 0; opexName = 'OPEX';
 cashAdvanceAmount = 0; cashAdvanceAmountCounter = 0; cashAdvanceCount = 0; cashAdvanceName = 'OPEX';
 cashRetireAmount = 0; cashRetireAmountCounter = 0; cashRetireCount = 0; cashRetireName = 'OPEX';
 totalAmount = 0; totalCounter = 0; totalCount = 0; totalName = 'OPEX';

loadRetirement(cashRetireAmount, cashRetireCount, cashRetireName) {
  this.cashRetireAmount = cashRetireAmount;
  this.cashRetireCount = cashRetireCount;
  this.cashRetireName =  cashRetireName;
}
loadTotal(totalAmount, totalCount, totalName) {
  this.totalAmount = totalAmount;
  this.totalCount = totalCount;
  this.totalName =  totalName;
}
loadAdvance(cashAdvanceAmount, cashAdvanceCount, cashAdvanceName) {
  this.cashAdvanceAmount = cashAdvanceAmount;
  this.cashAdvanceCount = cashAdvanceCount;
  this.cashAdvanceName =  cashAdvanceName;

}
 

  loadOpex(opexAmount, opexCount,opexName) {
    this.opexAmount = opexAmount;    
    this.opexCount = opexCount;
    this.opexName = opexName;
  }
}

@Component({
  selector: 'app-widget-expense-stats',
  templateUrl: './widget-expense-stats.component.html',
  styleUrls: ['./widget-expense-stats.component.css']
})
export class WidgetExpenseStatsComponent extends  WidgetComponentBaseComponent implements OnInit {


  dashboardTopStats: DashboardTopStats;
  expenseLoading = false;
 expenseData: ExpenseTopStatsOutput[] = [];


  constructor(injector: Injector,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy
  ) {
    super(injector);
    this.dashboardTopStats = new DashboardTopStats();
  }

  ngOnInit() {

    this.loadTopStatsData();
    
  }



  loadTopStatsData() {
    this.primengTableHelper.isLoading = true;
    this._tenantDashboardServiceProxy.getExpenseTopStats().pipe(
      finalize(() => {
        this.primengTableHelper.isLoading = false;
      })
  ).subscribe((data) => {
     this.expenseData = data;
     
     data.forEach(c => {
      switch (c.operationID) {
          case 7:
              this.dashboardTopStats.loadOpex(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;
          case 19:
              this.dashboardTopStats.loadAdvance(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;
          case 21:
              this.dashboardTopStats.loadRetirement(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;
          case 0:
              this.dashboardTopStats.loadTotal(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;

          default:
              break;
      }
     });
     
    });


  }



}
