import { AfterViewInit, Component, Injector, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ChartofAccountServiceServiceProxy,CreatePaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashAdvanceServiceServiceProxy, OperationsDto,  PayeeTypeDto, WorkflowMappingDto,PayeeNameViewDto,PaymentTransactionDto, WorkflowServiceServiceProxy, CreateCASetupDto, CASetupDto, BeneficiaryAccountProfilesServiceProxy, BeneficiaryAccountProfileDto, OperatingExpenseServiceServiceProxy, CurrencyDto, WorkflowTopStatsOutput, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CashAdvanceworkflowroutemodalComponent } from './cashadvanceworkflowroutemodal/cashadvanceworkflowroutemodal.component';
import { result } from 'lodash';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';



@Component({

  templateUrl: './capaymenttransaction.component.html',
  styleUrls: ['./capaymenttransaction.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
 // providers: [DatePipe]
})
export class CAPaymenttransactionComponent extends AppComponentBase implements OnInit, AfterViewInit {


  paytransForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

 paytrans:  CreatePaymentTransactionDto = new CreatePaymentTransactionDto();

  records:  PaymentTransactionDto[] = [];
  operationList: OperationsDto[] = [];
  casetrequesttypeList: CASetupDto[] = [];
  saving = false;
  startdate: moment.Moment;
  hasDate = false;
  mindate: Date;
  defBenid = abp.session.userId.toString();
  sdate: string;
  attachId: string;
  isCardTransaction = false;
  cardGL = '';
  cardList: BeneficiaryAccountProfileDto[] = [];
  cardListHold: BeneficiaryAccountProfileDto[] = [];

  payeetypelist: PayeeTypeDto[] = [];

  payeenamelist: PayeeNameViewDto[] = [];
  casetupnum = 0;

OPID = 19;
operationNarration = 'Cash Advance Requisition';


workflowLoading = false;
workflowData: WorkflowTopStatsOutput[] = [];
pendingAmount = 0; pendingAmountCounter = 0;
authorizedAmount = 0; authorizedAmountCounter = 0; 
declinedAmount = 0; declinedAmountCounter = 0;
totalworkflowAmount = 0; totalCounter = 0; 
  @ViewChild('cashadvanceWorkflowRouteModal', { static: true }) cashadvanceWorkflowRouteModal: CashAdvanceworkflowroutemodalComponent;

  totalAmount: any = 0;

uploadCount: any = 0;
  // @ViewChild('appdocuments', { static: true}) appdocuments: DocumentsComponent;
  @ViewChild("fileUpload", { static: true }) fileUpload: FileuploadComponent;
  taxtransprimengTableHelper = new PrimengTableHelper();
  isReady = false;

  splitcostprimengTableHelper = new PrimengTableHelper();

  saveButtonDisabled = false;
  initiateButtonDisable = true;
  levelfromWorkflowMapping: WorkflowMappingDto[]=[];
  selectedoperationId :any;
  currencyList : CurrencyDto[] = [];
  currencyRate = 0;
RateDescription = '';
payableAmountConverted: number = 0;
grossAmount: number = 0;
accountNumber = '';
cashadvanceSetupDto = new CASetupDto();
isAdmin = false;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _cashAdvance: CashAdvanceServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _workflowService: WorkflowServiceServiceProxy,
    private _router: Router,
    private _beneficiary: OperatingExpenseServiceServiceProxy,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy
    ) {

super(injector);
}



  ngOnInit(): void {

    this.isAdmin = this.isGranted('Pages.CashAdvance.Admin')
    

    this.OPID =  +this._activatedRoute.snapshot.paramMap.get('OPID');
    if (this.OPID==58) {
      this.isCardTransaction = true;
      this.operationNarration = 'Card Transaction Requisition';
    }
    

     

    this.paytrans.currency = "NGN";
    this.loadCardGL();
    this. loadCAPayTransaction();
     
   this.getCasetuprequestype();
   
    this.getNamee();
    this.getCAPayeeTpe();
    this.sdate = moment().format('DD/MM/YYYY');
    this.benName();

    this.checkLocalstorage();

this.getCurrencyList();
this.loadTopStatsData();
  

  }

  ngAfterViewInit(): void {



  }
  CheckRate() {
    this.RateDescription = "Rate: ";
    this.currencyRate = 1;
    this._operationService.getDefaultCurrency().subscribe((x) => {
        if (x !== null) {
            this._operationService
                .getCurrencyExchangeRateList()
                .subscribe((v) => {
                    if (x.currencyCode !== this.paytrans.currency) {
                        let y = 0;

                        try {
                            y = v.find(
                                (c) =>
                                    c.defaultCurrencyCode ==
                                        x.currencyCode &&
                                    c.exchangeCurrencyCode ==
                                        this.paytrans.currency
                            ).exchangeRate;
                        } catch (error) {}

                        if (y == 0) {
                            this.RateDescription = "Rate not setup";
                            this.currencyRate = null;
                        } else {
                            this.currencyRate = y;
                        }
                        this.payableAmountConverted =
                            this.grossAmount * this.currencyRate;
                    }
                });
        } else {
        }
    });
}

  getCurrencyList() {
    this.primengTableHelper.isLoading = true;
    this._operationService.getCurrencyList() .pipe(
      finalize(() => {
        this.saving = false;
        //this.hideMainSpinner();
        this.primengTableHelper.isLoading = false;
      })
    ).subscribe((x) => {
        this.currencyList = x;
    });
}

loadCardGL() {


  this._beneficiary.getBeneficiaryDetails(5, 'all').subscribe(result => {
    this.cardList = result;
    this.cardListHold = result;
    
  });
}

// showDocument(id: any) {
//  this.appdocuments.ShowAttachmentByRef(id, 19);
// }

fileDocument(id: any){
this.OPID = 19;

if( this.isCardTransaction){
  this.OPID = 58
}

  this.fileUpload.ShowAttachment(id, this.OPID);
 }

 totalCount(newCount: any){
 
       this.uploadCount = newCount;
       console.log(this.uploadCount);
 }

  getOperation() {

    this._operationService.getListOperation()
      .subscribe(items => {
        this.operationList = items;
      });
  }

  getCAPayeeTpe() {
    this._cashAdvance.getCAPayeeList().subscribe(result => {
      this.payeetypelist = result;

    });
  }

  getNamee() {
    this._cashAdvance.fetchCAPayeeName().subscribe(result => {
      this.payeenamelist = result;
    });
  }

  getNumofDays() {
    let ref = this.paytrans.caTransactionType;

    this._cashAdvance.getCASetup(ref).subscribe(item => {
      this.cashadvanceSetupDto = item;
      

    });

  }

  getNumandMax() {
    this.getNumofDays();
    this.checkmaxamount();
  }
  GetCurrency(){  
 
    if(this.cardListHold.length>0){
   var icar = this.cardListHold.filter(x => x.beneficiaryAccountNumber == this.accountNumber)[0];
   this.cardGL = icar.beneficiaryCode
   this.paytrans.currency = icar.beneficiaryCurrencyCode;
      
    } 
    
  }

  getCasetuprequestype() {
    this._cashAdvance.getCashAdvanceSetupActive()
      .subscribe(items => {
        this.casetrequesttypeList = items;



      });
  }



  save( paytransForm: NgForm) {
   // this.paytrans
   this.saveButtonDisabled = true;
    if (this.isCardTransaction && (this.cardGL == null || this.cardGL === undefined || this.cardGL === '') ) {

      this.notify.error('Please select card to proceed!', 'Card not selected', {timer: 5000, toast: true, position: 'top-end'});
    } else {

    if (this.totalAmount >= this.paytrans.amount) {
    //this.showMainSpinner();
    if(this.paytrans.amount <= 0){
      this.message.error(this.l('Amount cannot be  ') + this.paytrans.amount);
      this.paytrans.amount= 0;
      this.saveButtonDisabled  = false;
      return;
    }

    //if the card option apply
      this.paytrans.applyPrepayments = this.isCardTransaction;
      this.paytrans.invoiceNumber = this.cardGL;

    this.primengTableHelper.isLoading = true;
    this.saving = true;
      this.paytrans.tenantId = abp.session.tenantId;
      this.paytrans.attachId = this.attachId;

      this._cashAdvance
        .initiateCARequest(this.paytrans)
        .pipe(
          finalize(() => {
            this.saving = false;
            //this.hideMainSpinner();
            this.primengTableHelper.isLoading = false;
          })
        )
        .subscribe(
          (r) => {

          this.notify.info(this.l('SavedSuccessfully'));
         this.message.info(this.l('SavedSuccessfully') + ' Ref: ' + r.requestNumber + ' and' + ' Sent For Approval');
         
         this.accountNumber = '';
         this.loadCAPayTransaction();
         this.loadTopStatsData();
        localStorage.removeItem('attachId');
        localStorage.clear();
        this.paytrans = new CreatePaymentTransactionDto();
        this.totalAmount = 0;
      this.isReady = true;
      this.uploadCount=0;
      this.benName();
      this.paytrans.currency = "NGN";
      this.paytrans.applyPrepayments = false;
      this.saveButtonDisabled = false;

      
        }
        );

        this.hideMainSpinner();

        this.primengTableHelper.isLoading = false;
    
      } else {
        this.message.error(this.l('Amount has exceeded cash advance limit of ') + this.totalAmount);
         this.paytrans.amount=0;
         this.saveButtonDisabled  = false;
         return;
         //this.initiateButtonDisable = false;
      }
    }
  }



 benName() {
  this._cashAdvance.getLoginName().subscribe(result => {
    this.paytrans.payeeName = result;
  });
 }



  loadCAPayTransaction() {

    this.primengTableHelper.showLoadingIndicator();
    this._cashAdvance.getCAPaymentTransaction(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
          this.primengTableHelper.totalRecordsCount = result.length;
          if (this.primengTableHelper.totalRecordsCount > 0) {
             this.saveButtonDisabled  = true;
             this.initiateButtonDisable = false;
          } else {
             this.saveButtonDisabled = false;
            this.initiateButtonDisable = true;
          }
      this.primengTableHelper.records = result;
      this.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       
    });



  }


  //To validate maximum amount
  checkmaxamount() {
    let ref = this.paytrans.caTransactionType;

    this._cashAdvance.getMaxAmount(ref).subscribe(result => {
             this.totalAmount = result;
           });

  }


  //To Disable save button if payeetypeid and payeename are different vendors
  checkifvaluematched(payeeTypeId: number, payeeName: string, transactionTypeId: number) {

  }



  add(id?: any) {


  }



  addsplitcost(id?: any, amt?: number) {


    this.splitcostprimengTableHelper.showLoadingIndicator();

   }

   addworkflowroute() {





     this.cashadvanceWorkflowRouteModal.show();
   }

   // generate random id

   getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getAttach() {
  let getJSON = localStorage.getItem('attachId');
  if (getJSON) {
      this.attachId = JSON.parse(getJSON);
  }
}

checkLocalstorage() {
  localStorage.removeItem('attachId');
  localStorage.clear();
 this.getAttach();
 if (this.attachId === null || this.attachId === undefined) {

   this._cashAdvance.getAttachId().subscribe( x => {
    let sendJSON = JSON.stringify(x);
    this.attachId = x;
    localStorage.setItem('attachId', sendJSON);

  });

  }
  this.paytrans.attachId = this.attachId;

}


loadTopStatsData() {
  this.primengTableHelper.isLoading = true;

  //pass operation Id
  let operationId1 = 19;
  let operationId2=43;

  if(this.OPID==58){
    operationId1 =58;
    operationId2=60;
  }
  this._tenantDashboardServiceProxy.getWorkflowTopStats(operationId1,operationId2,0).pipe(
    finalize(() => {
      this.primengTableHelper.isLoading = false;
    })
).subscribe((data) => {
   this.workflowData = data;
  

   var pending = this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===1);
   pending.map(item => {

      this.pendingAmountCounter = item.numCount;
      this.pendingAmount= item.amount;

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
  
  var totalcount= this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===0);
  totalcount.map(item => {

      this.totalCounter = item.numCount;
      this.totalworkflowAmount= item.amount;

    });
console.log(authorized);
console.log(totalcount);


  
   
  });


}

}
