import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { OperationtrailmodalComponent } from '@app/shared/layout/operationtracker-bar/operationtrailmodal/operationtrailmodal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BankPostingMasterTransaction, BankPostingTransactionServiceServiceProxy, BeneficiaryTransactionStatus, ExpenseReportServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsTrackerServiceServiceProxy, PaymentServiceServiceProxy, PostingEntry, RefNoDto, TenantDashboardServiceProxy, WorkflowTopStatsOutput, WorkflowTrailDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { FileuploadComponent } from '../FileDocuments/fileupload/fileupload.component';
import { OpexquerymodalComponent } from '../opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
import { QueryHistoryComponent } from './queryHistory/queryhistory.component';
import { WorkflowDetailsComponent } from './workflow-details/workflow-details.component';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styles: [
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class TransactionHistoryComponent extends AppComponentBase implements OnInit {


  @ViewChild("fileUpload", { static: true }) fileUpload: FileuploadComponent;
  @ViewChild("opexqueryhistory", { static: true })  opexqueryhistory: QueryHistoryComponent;
  @ViewChild('workflowdetails', { static: true })    workflowdetails: WorkflowDetailsComponent;
@ViewChild('operationTrailModal', { static: true })    operationTrailModal: OperationtrailmodalComponent;
  @ViewChild('Opexquerymodal', { static: true })    Opexquerymodal: OpexquerymodalComponent;
  sampleDateRange: DateTime[] = [
    this._dateTimeService.getStartOfDayForDate(this._dateTimeService.getStartOfDayMinusDays(3)),
    this._dateTimeService.getEndOfDay(),
];
isDataLoading = false;
maxDate: any;

searchBox = '';
paymentRef ='';
errorMessage ='';
rmks = '';
id = 0;
isUser = false;
username = '';
currentusername = '';
approvalHistoryTrail: WorkflowTrailDto[] = [];
ParentRef: string;
listOfRequisitionApprovals = [19,21,7];
listofDeclinedMessages = [];
listofStatus = [];
payAdviceRef: string;

@ViewChild("modal", { static: true }) modal: ModalDirective;
@ViewChild("modaldecline", { static: true }) modaldecline: ModalDirective;
@ViewChild("modalmsg", { static: true }) modalmsg: ModalDirective;
@ViewChild("modalhistory", { static: true }) modalhistory: ModalDirective;
@ViewChild("modalDeclinedMessages", { static: true }) modalDeclinedMessages: ModalDirective;

@ViewChild('dataTablePayment', { static: true }) dataTablePayment: Table;
@ViewChild('dataTableEntityChanges', { static: true }) dataTableEntityChanges: Table;
@ViewChild('paginatorEntityChanges', { static: true }) paginatorEntityChanges: Paginator;
@ViewChild('paginatorPayment', { static: true }) paginatorPayment: Paginator;


primengTableHelperPayment = new PrimengTableHelper();
public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];
itemLedgerPosting : PostingEntry[] = [];
postedbankBeneficiary: BeneficiaryTransactionStatus[] = [];
selectedItems: BankPostingMasterTransaction[] = [];

workflowLoading = false;
workflowData: WorkflowTopStatsOutput[] = [];
ARApprovalCounter = 0; ARApprovalTitle:any;
pendingRetirementCounter = 0;pendingRetirementTitle:any;
FRApprovalCounter = 0; FRApprovalTitle: any;
FRACheckerCounter = 0;  FRACheckerTitle:any;
PBankCounter = 0; PBankTitle: any;
 RetiredCounter = 0; RetiredTitle: any;
truncatedCounter = 0; truncatedTitle: any;
declinedCounter = 0;  declinedTitle: any;
failedCounter = 0; failedTitle : any;
 tankedCounter = 0;  tankedTitle: any;
awaitingPaymentTotal=0;
FApprovalCounter=0; FApprovalTitle: any;
FACheckerCounter= 0; FACheckerTitle: any;
CAAwaitingApprovalCounter = 0; CAAwaitingApprovalTitle: any;
totalCount = 0; 
ViewType = '';



constructor(
  injector: Injector,
    private _payment: PaymentServiceServiceProxy,
    private _dateTimeService: DateTimeService,
    private _fileDownloadService: FileDownloadService,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy,
    private _bp: BankPostingTransactionServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _transReport: ExpenseReportServiceServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _oprstrackerservice:OperationsTrackerServiceServiceProxy,
) {
  super(injector);
  this.maxDate = new Date();
}
  ngOnInit(): void {

     this.ViewType = 'Transaction History';
    this.id =  +this._activatedRoute.snapshot.paramMap.get('id');
    this.currentusername = this.appSession.user.userName;
    if (this.id==100) {
      this.isUser = true;
      this.username = this.appSession.user.userName;
      this.ViewType = 'Request History';
    }

   // this.loadTopStatsData();
  }

  getData(){
    
    this.getLogs();
  }
  filterGridData(status:any){
    debugger
    this.searchBox = status;
    this.getLogs();
  }

  getLogs(event?: LazyLoadEvent) {
    if (this.primengTableHelperPayment.shouldResetPaging(event)) {
        this.paginatorPayment.changePage(0);
        return;
    }


    this.primengTableHelperPayment.isLoading = true;
    this._payment.getPaymentsHistory( this.searchBox,0 , this.isUser, this.username, this.dateRange[0], this.dateRange[1],
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
        this.awaitingPaymentTotal=result.totalCount;
        this.loadTopStatsData();
      });

  }

  ExportTOExcel(event?: LazyLoadEvent){

    this._payment.getDataToExcel(this.searchBox,0, this.isUser, this.username,  this.dateRange[0], this.dateRange[1],this.primengTableHelperPayment.getSorting(this.dataTablePayment),
      this.primengTableHelperPayment.getMaxResultCount(this.paginatorPayment, event),
      this.primengTableHelperPayment.getSkipCount(this.paginatorPayment, event)).subscribe(c => {

        this._fileDownloadService.downloadTempFile(c);

      });
  }

  close() {
    this.modal.hide();
  }

  PostToFinance(RefNo) {
    this.message.confirm(
        "Are you sure you want to POST this transaction",
        "Post to Finance module",
        (isConfirmed) => {
            if (isConfirmed) {


                this.primengTableHelperPayment.isLoading = true;
                this._bp.postToFinance(RefNo).pipe(finalize(() => (this.primengTableHelperPayment.isLoading = false)))
                .subscribe((x) => {


                  let msg = x;
                  this.message.info(msg, "Transaction Ledger Posting");
                    this.getLogs();

                });

            }
        }
    );
}

  viewBeneficiary(RefNo, OPID) {
    this.primengTableHelper.isLoading = true;

    this.paymentRef = RefNo;



    this._opex.getApprovalPaymentDetails(RefNo).subscribe((x) => {
        this._bp.getPostingDetailsByRefAndOPID(x.paymentRequest.pVoucherNo, x.paymentRequest.operationId).subscribe((u) => {
            this.itemLedgerPosting = u.ledgerPosting;
            console.log(this.itemLedgerPosting);
            if(OPID==19){
            this.paymentRef = x.paymentRequest.pRefNo;
            }

         });

         this._bp.getTransactionStatusDetails(RefNo).subscribe((x) => {
          this.postedbankBeneficiary = x;
          this.primengTableHelper.isLoading = false;

          this.payAdviceRef = RefNo;

          console.log("The Posted Beneficiary is ",RefNo);
      });




         this.modal.show();


    });
  //}
}

onShown(){
  console.log('');

}

declineTransaction() {

  let selectedItem: string[] = [];
  selectedItem.push(this.paymentRef);
      this.message.confirm(
          "Are you sure you want to TRUNCATE this transaction",
          "Cancel Ledger Posting",
          (isConfirmed) => {
            if (isConfirmed) {
              this.showMainSpinner();

              this._bp
                  .declineTransaction(this.rmks,selectedItem)
                  .pipe(finalize(() => this.hideMainSpinner()))
                  .subscribe(() => {
                      this.message.info(
                          "Transaction truncated successfully",
                          "Truncate transaction"
                      );
                      this.getLogs();


                      this.closeDecline();
                  });
          }
        }
      );

}

viewDelineModal(RefNo){
  this.paymentRef = RefNo;
  this.modaldecline.show();
 }
 closeDecline(){
     this.rmks = "";
     this.errorMessage ="";
     this.modaldecline.hide();
     this.modalmsg.hide();
     this.modalhistory.hide();
     this.modalDeclinedMessages.hide();
 }


loadTopStatsData(event?: LazyLoadEvent) {


  this.isDataLoading = true;

this._payment.getTransactionStats(this.searchBox,0 , this.isUser, this.username, this.dateRange[0], this.dateRange[1],
  this.primengTableHelperPayment.getSorting(this.dataTablePayment),
  1,
  1).pipe(
        finalize(() => {
          this.isDataLoading = false;
        })
    )  .subscribe(x => {
    
      
       let ll = x.filter(e => e.narration == 'Tanked')[0];
       var x1 = x.filter(e => e.narration === 'Active');
        x1.map(item => {
          this.CAAwaitingApprovalCounter = item.count;
         
        });

        var x2 = x.filter(e => e.id === 2);
        x2.map(item => {
          this.FApprovalCounter = item.count;
        
        });
      var x27 = x.filter(e => e.narration === 'Finance Approval Checker');
        x27.map(item => {
          this.FApprovalCounter = item.count;
        
        });
      //  var x3= x.filter(e => e.id === 3);
      //  x3.map(item => {
      //   this.FRACheckerCounter = item.count;
      
      //  });
      
      //  var x4 = x.filter(e => e.id === 4);
      //  x4.map(item => {
      //   this.pendingRetirementCounter = item.count;
       
      //  });

       var x5 = x.filter(e => e.narration === 'Paid');
       x5.map(item => {
        this.ARApprovalCounter = item.count;
       });
      
      var x6= x.filter(e => e.narration === 'FR Approver');
      x6.map(item => {
        this.FRApprovalCounter  = item.count;
      });
      
      var x7 = x.filter(e => e.narration === 'Finance Retirement Approval Checker');
      x7.map(item => {
        this.FRACheckerCounter = item.count;
      });
       
      var x8 = x.filter(e => e.narration === 'Retired');
      x8.map(item => {
        this.RetiredCounter = item.count;
        //this.RetiredTitle = item.narration;
      });
       
      var x9 = x.filter(e => e.narration === 'Payment - Bank');
      x9.map(item => {
        this.PBankCounter = item.count;
       
      });

      var x10 = x.filter(e => e.narration === 'Tanked');
      x10.map(item => {
        this.tankedCounter= item.count;
        
      });
       
      var x11 = x.filter(e => e.narration === 'Failed');
      x11.map(item => {
        this.failedCounter = item.count;
       // this.failedTitle = item.narration;
      });
     
       var x12 = x.filter(e => e.narration ==='Truncated');
       x12.map(item => {
        this.truncatedCounter = item.count;
        //this.truncatedTitle = item.narration;
       });
        
       var x13 = x.filter(e => e.narration === 'Declined');
       x13.map(item => {
        this.declinedCounter = item.count;
       // this.declinedTitle = item.narration;
       });
    
       this.totalCount = this.declinedCounter + this.truncatedCounter + this.failedCounter +this.tankedCounter +this.PBankCounter +this.RetiredCounter +this.FRACheckerCounter +this.FRApprovalCounter +this.ARApprovalCounter +this.pendingRetirementCounter  +this.FApprovalCounter + this.CAAwaitingApprovalCounter;
       if(this.isUser){
       // let nw = { count: ll.count, narration: 'Awaiting Retirement'}
        this.tankedTitle = "Awaiting Retirement";
      //  this.listofStatus = x.map( u=> u.narration !== 'Tanked' ? u: nw);
       }else{
        this.listofStatus = x;
        this.tankedTitle = "Tanked";
       }       
      
      //  ARApprovalCounter = 0; pendingRetirementCounter = 0;
      //  FRApprovalCounter = 0; FRACheckerCounter = 0;
      //  PBankCounter = 0; RetiredCounter = 0;
      //  truncatedCounter = 0; declinedCounter = 0;
      //  totalworkflowAmount = 0; totalCounter = 0;
      //  awaitingPaymentTotal=0;
      //  FApprovalCounter=0; FACheckerCounter= 0;
      console.log(  x);


  });



}

ViewPayAdvance(RefNo){
    
  let yURL =  AppConsts.reportUrl + "?TypeId=10" + "&RefNo=" +  this.payAdviceRef;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(yURL,"_blank", params);



}


exportPaymentSchedule() {
  let trail = document.getElementById('excel-tableBank');
const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(trail);
const wb: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
XLSX.writeFile(wb, 'paymentfile.xlsx');

}

ViewDeclineMessages(ref, OPID, PaymentRef){
  this.primengTableHelper.isLoading = true;
   let listofRef = [];
   listofRef.push(ref);

   if (!this.listOfRequisitionApprovals.includes(OPID)) {
   listofRef.push(PaymentRef);
  }

  this._payment.getDeclinedMessages(listofRef).pipe(
    finalize(() => {
      this.primengTableHelper.isLoading = false;
    })
).subscribe((x) => {

  console.log(x);
this.listofDeclinedMessages = x;

 });

 this.modalDeclinedMessages.show();

}

ViewError(PaymentRef,viewTypeID){

  this.primengTableHelper.isLoading = true;
  this._payment.getPostingMessage(PaymentRef).pipe(
    finalize(() => {
      this.primengTableHelper.isLoading = false;
    })
).subscribe((x) => {

this.errorMessage = x;

 });




  this.modalmsg.show();

}


ViewDetails(PaymentRef, opid, isdeleted) {
console.log(PaymentRef);
console.log(opid);
  if (isdeleted){
    this.workflowdetails.getData(PaymentRef, opid);
  }else
{

  this.primengTableHelper.isLoading = true;
  console.log("The Payment Ref is--",PaymentRef);
  this._opex.getApprovalPaymentDetails(PaymentRef).pipe(
    finalize(() => {
      this.primengTableHelper.isLoading = false;
    })
).subscribe((x) => {
 this.workflowdetails.getData(PaymentRef, x.paymentRequest.operationId);
  });

}




}


ViewApproval(PaymentRef){




  this.primengTableHelper.showLoadingIndicator();
  this._oprstrackerservice.getTrail(PaymentRef
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;

    this.primengTableHelper.hideLoadingIndicator();
     console.log(result);
  });
  this.modalhistory.show();







//   this._transReport.getAdvanceDetails(PaymentRef).pipe(
//     finalize(() => {
//       this.primengTableHelper.isLoading = false;
//     })
// ).subscribe((c) => {

//     this.approvalHistoryTrail = c.approvalDetails;
//     console.log(this.approvalHistoryTrail);
//     this.modalhistory.show();
//   });

}

processManual(ref){

  this.message.confirm(
    "Are you sure you want to process this transaction manually",
    "Manual Processing",
    (isConfirmed) => {
      if (isConfirmed) {
        this.showMainSpinner();

        this._bp
            .manualProcessing(ref)
            .pipe(finalize(() => this.hideMainSpinner()))
            .subscribe(() => {

                let msg = "Transaction processed manually";
                this.message.info(msg, "Transaction Manual Entry");
                this.getLogs();
            },(s) => {

                this.getLogs();
            }
            );


    }
  }
);
}


RetriggerTransaction(ref) {


  let selectedItem: string[] = [];

  selectedItem.push(ref);
      this.message.confirm(
          "Are you sure you want to retry this transaction",
          "Post to Bank",
          (isConfirmed) => {
            if (isConfirmed) {
              this.showMainSpinner();

              this._bp
                  .postTransaction('retrigger', selectedItem)
                  .pipe(finalize(() => this.hideMainSpinner()))
                  .subscribe(() => {

                      let msg = "Transaction Retrigger";
                      this.message.info(msg, "Transaction Posting Retry");
                      this.getLogs();
                  },(s) => {
                      selectedItem = [];

                      this.getLogs();
                  }
                  );


          }
        }
      );

}


approveTransaction(ref) {


  let selectedItem: string[] = [];

  selectedItem.push(ref);
      this.message.confirm(
          "Are you sure you want to retry this transaction",
          "Post to Bank",
          (isConfirmed) => {
            if (isConfirmed) {
              this.showMainSpinner();

              this._bp
                  .postTransaction('Retry', selectedItem)
                  .pipe(finalize(() => this.hideMainSpinner()))
                  .subscribe(() => {

                      let msg = "Transaction sent for processing";
                      this.message.info(msg, "Transaction Posting Retry");
                      this.getLogs();
                  },(s) => {
                      selectedItem = [];

                      this.getLogs();
                  }
                  );


          }
        }
      );

}

viewAttachments(id,OPID, isdeleted){
let refNoDto = new RefNoDto();
  //  console.log("The OperationID is",OPID);
if(isdeleted ){
 // this.fileUpload.ShowAttachmentByRefOnly(id);
  console.log("The OperationID of deleted Transaction",OPID);

  this.fileUpload.ShowAttachmentByParentRef(id);
}

else{

    this.fileUpload.ShowAttachmentByParentRef(id);
}

}
viewQuery(id,opid){
  this.opexqueryhistory.loadWorkflowqueryTrail(id, opid);
  console.log("The OperationID at PaymentHistory is" + " " + opid);

//  this.Opexquerymodal.show(id,0, this.appSession.user.userName, opid);

}



}
