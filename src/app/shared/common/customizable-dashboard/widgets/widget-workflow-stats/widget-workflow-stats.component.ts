import { Component, Injector, OnInit } from '@angular/core';
import { ExpenseTopStatsOutput, TenantDashboardServiceProxy, WorkflowTopStatsOutput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { DashboardChartBase } from '../dashboard-chart-base';
import { WidgetComponentBaseComponent } from '../widget-component-base';
class DashboardTopStats extends DashboardChartBase {



  pendingAmount = 0; pendingAmountCounter = 0;pendingCount = 0; pendingName = 'pending';
  authorizedAmount = 0; authorizedAmountCounter = 0; authorizedCount = 0; authorizedName = 'decline';
  declinedAmount = 0; declinedAmountCounter = 0; declinedCount = 0; declinedName = 'authorized';
  totalAmount = 0; totalCounter = 0; totalCount = 0; totalName = 'WORKFLOW';
 
 loadPeding(pendingAmount,pendingCount, pendingName) {
   this.pendingAmount = pendingAmount;
   this.pendingCount = pendingCount;
   this.pendingName = pendingName;
 }
 loadTotal(totalAmount, totalCount, totalName) {
   this.totalAmount = totalAmount;
   this.totalCount = totalCount;
   this.totalName =  totalName;
 }
 loadAuthorized(authorizedAmount, authorizedCount, authorizedName) {
   this.authorizedAmount = authorizedAmount;
   this.authorizedCount =authorizedCount;
   this.authorizedName =  authorizedName;
 
 }
  
 
   loadDeclined(declinedAmount, declinedCount,declinedName) {
     this.declinedAmount = declinedAmount;    
     this.declinedCount = declinedCount;
     this.declinedName =declinedName;
   }
 }
 
@Component({
  selector: 'app-widget-workflow-stats',
  templateUrl: './widget-workflow-stats.component.html',
  styleUrls: ['./widget-workflow-stats.component.css']
})
export class WidgetWorkflowStatsComponent extends  WidgetComponentBaseComponent implements OnInit {

  dashboardTopStats: DashboardTopStats;
  workflowLoading = false;
 workflowData: WorkflowTopStatsOutput[] = [];


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
    this._tenantDashboardServiceProxy.getWorkflowTopStats(7,42,0).pipe(
      finalize(() => {
        this.primengTableHelper.isLoading = false;
      })
  ).subscribe((data) => {
     this.workflowData = data;
     
     data.forEach(c => {
      switch (c.opid) {
          case 1:
              this.dashboardTopStats.loadPeding(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;
          case 2:
              this.dashboardTopStats.loadDeclined(
                  c.amount,
                  c.numCount,
                  c.operationName
              );
              break;
          case 3:
              this.dashboardTopStats.loadAuthorized(
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
