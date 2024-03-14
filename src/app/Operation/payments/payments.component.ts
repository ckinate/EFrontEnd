import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { PaymentServiceServiceProxy, TenantDashboardServiceProxy, WorkflowTopStatsOutput } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CadComponent } from './cad/cad.component';
import { CarComponent } from './car/car.component';
import { OpexComponent } from './opex/opex.component';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styles: [
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class PaymentsComponent extends AppComponentBase implements OnInit {

  @ViewChild("appcadModal", { static: true }) appcadModal: CadComponent;
  @ViewChild("appcarModal", { static: true }) appcarModal: CarComponent;
  @ViewChild("appopexModal", { static: true }) appopexModal: OpexComponent;

  
  searchBox = '';
  @ViewChild('dataTablePayment', { static: true }) dataTablePayment: Table;
  @ViewChild('dataTableEntityChanges', { static: true }) dataTableEntityChanges: Table;
  @ViewChild('paginatorEntityChanges', { static: true }) paginatorEntityChanges: Paginator;
  @ViewChild('paginatorPayment', { static: true }) paginatorPayment: Paginator;

  @ViewChild("modalDeclinedMessages", { static: true }) modalDeclinedMessages: ModalDirective;
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];
  primengTableHelperPayment = new PrimengTableHelper();
  listofDeclinedMessages = [];
  workflowLoading = false;
workflowData: WorkflowTopStatsOutput[] = [];
pendingAmount = 0; pendingAmountCounter = 0;
authorizedAmount = 0; authorizedAmountCounter = 0; 
declinedAmount = 0; declinedAmountCounter = 0;
totalworkflowAmount = 0; totalCounter = 0; 
 
  constructor(

    injector: Injector,
    private _payment: PaymentServiceServiceProxy,
    private _dateTimeService: DateTimeService,
    // private _router: Router,
    private _fileDownloadService: FileDownloadService,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy

  )


   {
    super(injector);

   }


  ngOnInit(): void {
     this.loadTopStatsData();
   }

   processItem(opid, refNo, payee){
    if (opid==7) {
      this.appopexModal.show(refNo, payee);
    }
    if (opid==19) {
      this.appcadModal.show(opid, refNo, payee);
    }
    if (opid==21) {
      this.appcarModal.show(payee,refNo, opid);
    }
    if(opid==62){
      this.appcarModal.show(payee,refNo, opid);
    }
    console.log("The OperationID is " + "" + opid);

   }
  
   getLogs(event?: LazyLoadEvent) {
    if (this.primengTableHelperPayment.shouldResetPaging(event)) {
        this.paginatorPayment.changePage(0);
        return;
    }

    this.primengTableHelperPayment.isLoading = true;
    this._payment.getAllOutStandingPayments( this.searchBox,0, false, '' ,this.dateRange[0], this.dateRange[1],
        this.primengTableHelperPayment.getSorting(this.dataTablePayment),
        this.primengTableHelperPayment.getMaxResultCount(this.paginatorPayment, event),
        this.primengTableHelperPayment.getSkipCount(this.paginatorPayment, event)
    ).pipe(
      finalize(() => {
        this.primengTableHelperPayment.isLoading = false;
      })
  ).subscribe((result) => {
        this.primengTableHelperPayment.totalRecordsCount = result.totalCount;
        this.primengTableHelperPayment.records = result.items;

        this.pendingAmountCounter=this.primengTableHelperPayment.records.length;
        console.log(result);
        
        
      });
  }
  ViewDeclineMessages(ref, OPID, PaymentRef){
    this.primengTableHelper.isLoading = true;
     let listofRef = [];
     listofRef.push(ref);
  
    
    this._payment.getDeclinedMessages(listofRef).pipe(
      finalize(() => {
        this.primengTableHelper.isLoading = false;
      })
  ).subscribe((x) => {
  
    
  this.listofDeclinedMessages = x;
  
   });
  
   this.modalDeclinedMessages.show();
  
  }
  

  ExportTOExcel(event?: LazyLoadEvent){
    let y = new DateTime();
    this._payment.getDataToExcel(this.searchBox,0,false,'',this.dateRange[0], this.dateRange[1],this.primengTableHelperPayment.getSorting(this.dataTablePayment),
      this.primengTableHelperPayment.getMaxResultCount(this.paginatorPayment, event),
      this.primengTableHelperPayment.getSkipCount(this.paginatorPayment, event)).subscribe(c => {

        this._fileDownloadService.downloadTempFile(c);

      });
  }

  
  loadTopStatsData() {
    this.primengTableHelper.isLoading = true;
    this._tenantDashboardServiceProxy.getPaymentTopStats().pipe(
      finalize(() => {
        this.primengTableHelper.isLoading = false;
      })
  ).subscribe((data) => {
     this.workflowData = data;
    
  
     var pending = this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===1);
     pending.map(item => {

        this.totalCounter = item.numCount;
        this.totalworkflowAmount= item.amount;
  
      })

      var authorized = this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===3);
      authorized.map(item => {

        this.authorizedAmountCounter = item.numCount;
        this.authorizedAmount= item.amount;
  
      })
    
    var declined= this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===2);
    declined.map(item => {

        this.declinedAmountCounter = item.numCount;
        this.declinedAmount= item.amount;
  
      })
    
    // var totalcount= this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===1);
    // pending.map(item => {

    //     this.totalCounter = item.numCount;
    //     this.totalworkflowAmount= item.amount;
  
    //   });



    
     
    });


  }

  closeDecline(){    
    this.modalDeclinedMessages.hide();
}

onShown(){

}


}
