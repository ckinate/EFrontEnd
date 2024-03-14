import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
// import { ChartofAccountServiceServiceProxy, CreateCAPaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashAdvanceServiceServiceProxy, OperationsDto, CAPayeeNameViewDto, CAPayeeTypeDto, CAPaymentTransactionDto, CATransactionTypeDto, WorkflowMappingDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
//import { ChartofAccountServiceServiceProxy,CreateCashRetirementDto, GeneralOperationsServiceServiceProxy, CashRetirementServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsDto, TransactionTypeDto,  GetAdvanceDto, WorkflowMappingDto,PayeeNameViewDto,CashRetirementDto, WorkflowServiceServiceProxy} from '@shared/service-proxies/service-proxies';
//import { ChartofAccountServiceServiceProxy,CreatePaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashRetirementServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsDto, TransactionTypeDto,  GetAdvanceDto, WorkflowMappingDto,PayeeNameViewDto,PaymentTransactionDto, WorkflowServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import { ChartofAccountServiceServiceProxy,CreatePaymentTransactionDto, GeneralOperationsServiceServiceProxy, CashRetirementServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsDto, TransactionTypeDto, WorkflowMappingDto,PayeeNameViewDto,PaymentTransactionDto, WorkflowServiceServiceProxy, BeneficiaryAccountProfilesServiceProxy, BeneficiaryAccountProfileDto, VendorDto, VendorsServiceProxy, WorkflowTopStatsOutput, TenantDashboardServiceProxy, DocumentServiceProxy} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Table, TabViewModule } from 'primeng';
import { finalize } from 'rxjs/operators';

//import { CashAdvanceworkflowroutemodalComponent } from './cashadvanceworkflowroutemodal/cashadvanceworkflowroutemodal.component';
//import { CASplitcostmodalComponent } from './casplitcostmodal/casplitcostmodal.component';
//import { TaxtransactionmodalComponent } from './taxtransactionmodal/taxtransactionmodal.component';
//import { FileuploadComponent } from '@app/admin/fileupload/fileupload.component';
import { result } from 'lodash';
import { SplitcostmodalComponent } from '@app/operation/opex/paymenttransaction/splitcostmodal/splitcostmodal.component';
import { DocumentsComponent } from '@app/operation/documents/documents.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CashAdViewHistoryComponent } from './CashAdRequestHistory/cashAdViewHistory.component';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';


@Component({

  templateUrl: './cashretirement.component.html',
  styleUrls: ['./cashretirement.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CashRetirementComponent extends AppComponentBase implements OnInit, AfterViewInit {



  payctransForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  @ViewChild("cashadviewhistory", { static: true })  cashadviewhistory: CashAdViewHistoryComponent;

 paytrans:  CreatePaymentTransactionDto = new CreatePaymentTransactionDto();

  records:  PaymentTransactionDto[] = [];
  operationList: OperationsDto[] = [];
  catransactionTypeList: TransactionTypeDto[] = [];

  saving = false;
  startdate: moment.Moment;
  hasDate = false;
  mindate : Date;
  defBenid=abp.session.userId.toString();
  isCardTransaction = false;
  cardGL = '';
  CAType = '';
  currency = '';
  currencyRate = 1;
  totalValue = 0;
  endDate = '';

  workflowLoading = false;
  workflowData: WorkflowTopStatsOutput[] = [];
  pendingAmount = 0; pendingAmountCounter = 0;
  authorizedAmount = 0; authorizedAmountCounter = 0;
  declinedAmount = 0; declinedAmountCounter = 0;
  totalworkflowAmount = 0; totalCounter = 0;
  isPayeeSelected: boolean = false;

  //payeetypelist: PayeeTypeDto[]=[];

  payeenamelist: PayeeNameViewDto[]=[];

  //cashadvlist:GetAdvanceDto[]=[];
  cashadvlist:PaymentTransactionDto[]=[];
  rAmount=0;
  sAmount=0;
  cAmount=0;
  aAmount=0;
  advno="";
 cashadvanceDto= new PaymentTransactionDto();
  //casetupnum: CreateCASetupDto=new CreateCASetupDto;
vendorpayeeList:VendorDto[]=[];
DeclineComment: string;
uploadCount: any = 0;
supportingDocumentCount: any = 0;
 // @ViewChild('taxTransactionModal', { static: true }) taxTransactionModal: TaxtransactionmodalComponent;

  @ViewChild('splitCostModal', { static: true }) splitCostModal: SplitcostmodalComponent;

  //@ViewChild('cashadvanceWorkflowRouteModal', { static: true }) cashadvanceWorkflowRouteModal: CashAdvanceworkflowroutemodalComponent;

  totalAmount: any = 0;

OPID = 21;
  operationNarration = 'Cash Advance Retirement';
// @ViewChild('appdocuments', { static: true}) appdocuments: DocumentsComponent;
@ViewChild("fileUpload", { static: true }) fileUpload: FileuploadComponent;

taxtransprimengTableHelper = new PrimengTableHelper();
  isReady = false;

  splitcostprimengTableHelper = new PrimengTableHelper();
   payeevendor='';
   newpayeevendor:VendorPayee;

  saveButtonDisabled = false;
  initiateButtonDisable = true;
  levelfromWorkflowMapping: WorkflowMappingDto[]=[];
  selectedoperationId :any;
  paymentRef: any;
  modalRef: BsModalRef;
  @Output() modalSaveR: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('carModal' , {static: true}) modal: ModalDirective;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _cashAdvance: CashRetirementServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _workflowService: WorkflowServiceServiceProxy,
    private _opex:OperatingExpenseServiceServiceProxy,
    private _vendor: VendorsServiceProxy ,
    private _dateTimeService: DateTimeService,
    private _tenantDashboardServiceProxy: TenantDashboardServiceProxy,
    private _router: Router,
    private modalService: BsModalService,
    private _service: DocumentServiceProxy
    ) {

super(injector);
}

  ngOnInit(): void {
    this.primengTableHelper.isLoading = true;
    this.OPID =  +this._activatedRoute.snapshot.paramMap.get('OPID');
    if (this.OPID==62) {
      this.isCardTransaction = true;
      this.operationNarration = 'Card Transaction Requisition';
    }


    // this. loadCARetirement();
    // //this.getNumofDays();
   ////  this.getOperation();
     this.getcatransactionType();

  //this. getCaRTotalAmount();
  //this.getCNamee();
  this.getCAdvance();
////this.paytrans.payeeName=abp.session.userId.toString();
 this.getAllApprovedVendor();


this.loadCARetirement();

this.loadTopStatsData();

  this.primengTableHelper.isLoading = false;


  }

  ngAfterViewInit(): void {



  }




// showDocument(id: any){

getAllApprovedVendor(){
    this._vendor.getAllAprrovedVendors().subscribe(result=>{
      this.vendorpayeeList = result;
      console.log(result)

    })
}


totalCountOfSupportingDocument(){
 
   
    this._service.getFilesByParentRef(this.paytrans.requestNumber).subscribe(x=>{
      this.supportingDocumentCount  = x.length;
      
    })
  
}

totalupload(newCount: any){
  this.uploadCount = newCount;
}


 fileDocument(id: any){
    this.fileUpload.ShowAttachment(id, this.OPID);
 }
 showAttachFileDocument(id: any){
     if(id == null){
     this.message.error("Please Select Retirement Transaction");
     }

     else{
        //  if(this.OPID != 62){

        //      this.showMainSpinner();
        //     this._cashAdvance.getCashAdPayRef(id).subscribe((res)=>{
        //         this.hideMainSpinner();

        //         this.fileUpload.ShowAttachmentByRefOnly(res);
        //      })
        //  }

       //  this.fileUpload.ShowAttachmentByRefOnly(id);
         this.fileUpload.ShowAttachmentByParentRef(id);

     }


 }
 viewHistory(Ref:any){
 this.cashadviewhistory.show(Ref,this.OPID);
 console.log("The Ref No is", Ref );
 }
  getOperation() {

    this._operationService.getListOperation()
      .subscribe(items => {
        this.operationList = items;



      });
  }
  getCNamee(){
    let refNo =this.paytrans.requestNumber;
        this._cashAdvance.fetchCARPayeeName(refNo).subscribe(result =>{
         this.cashadvanceDto=result;
      this.paytrans.payeeName = this.cashadvanceDto.payeeName;
      this.paytrans.requestType=this.cashadvanceDto.caTransactionType;
    })
  }
  getCAdvance(){
    this._cashAdvance.fetchAdvance().subscribe(result=>{
      if (this.OPID == 62) {
        this.cashadvlist=result.filter(x =>x.operationId == 58 || x.operationId == 62);
        this.totalCounter= this.cashadvlist.length;
      }else{
        this.cashadvlist = result.filter(x =>x.operationId == 19 || x.operationId == 43);
        this.totalCounter= this.cashadvlist.length;
      }
    })
  }

  getcatransactionType() {

    this._opex.getTransactionTypeActive()
      .subscribe(items => {
        this.catransactionTypeList = items;




      });

      if(this.catransactionTypeList != null){
         this.saveButtonDisabled = true;
      }
  }

  openModal(template: TemplateRef<any>) {
    const config: ModalOptions = {
        class: "modal-dialog-centered",
    };
    this.modalRef = this.modalService.show(template, config);
}
close(): void {
  this.modal.hide();
}

deleterequest() {
  if (this.DeclineComment == null || this.DeclineComment == "") {
      return;
  } else {
      if (this.paytrans.requestNumber == null || this.paytrans.requestNumber == undefined) {
        this.message.error(
          this.l(
              "Please select a voucher number"
          )
      );
      } else {
          //this.modalRef.hide();
          this.message.confirm(
              this.l("Do you want to proceed?"),
              this.l(
                  "Please, You have just clicked to truncate card transaction with Reference No:" +
                      " " +
                      this.paytrans.requestNumber +
                      "\n" +
                      "Reason:" +
                      " " +
                      this.DeclineComment +
                      "."
              ),
              (isConfirmed) => {
                  if (isConfirmed) {
                      this._cashAdvance
                          .truncateCardNotInUse(
                              this.paytrans.requestNumber,
                              this.DeclineComment
                          )
                          .subscribe(() => {
                              this.notify.success(
                                  this.l(
                                      "Transaction truncated successfully"
                                  )
                              );
                                         this.DeclineComment = '';
                              this.modalSaveR.emit();
                              this.getCAdvance();
                              this.DeclineComment = null;
                              this.paytrans.requestNumber=null;
                              
                              this.paytrans = new CreatePaymentTransactionDto();
                             // this.ngOnInit();
                             this.modalRef.hide()
                          });
                  } else {
                      this.DeclineComment = null;
                  }
                  this.close();
              }
          );
      }
  }
}


  save( paytrans: CreatePaymentTransactionDto) {




   if( !this.payeevendor || !this.paytrans.narration || !this.paytrans.transactionTypeId || (this.paytrans.amount==0) || !this.paytrans.requestNumber){
     alert("please kindly fill form appropriately");
   }else{
  //  this.primengTableHelper.isLoading = true;
  // this.showMainSpinner();
    if (this.paytrans.id==""|| this.paytrans.id == null) {
      this.saving = true;
      this.paytrans.tenantId = abp.session.tenantId;


       let vendorValue = Object.values(this.payeevendor);

     this.paytrans.vendorPayeeName= vendorValue.toString();

       this.paytrans.applyPrepayments = this.isCardTransaction;
       this.paytrans.invoiceNumber = this.cardGL;
       this.paytrans.currency =  this.currency;
       this._cashAdvance.isCashAdvanceTransactionTypeExist(this.paytrans).subscribe(r=>{
         if(r >"0"){
          this.primengTableHelper.isLoading = false;
           return  this.message.error("The Expense Type Exist for this Transaction");

         }
         else{

          this._cashAdvance
          .createCashRetirement(this.paytrans)
          .pipe(
            finalize(() => {
              this.primengTableHelper.isLoading = false
            })
          )
          .subscribe(() => {

            this.notify.success(this.l('SavedSuccessfully'));
            this.paytrans = new CreatePaymentTransactionDto();
            this.isPayeeSelected = true;

           this.loadCARetirement();
           this.loadTopStatsData();
           //this.varAmtCal();
           //this.paytrans.amount=this.totalAmount;
          // this.paytrans.amount=this.cAmount;
           this.paytrans.requestNumber=this.advno;
           this.getDetails();
           this.saving=false;
           this.payeevendor=null;

           this.primengTableHelper.isLoading = false;
           //location.reload();
          });

         }
       })


      }
      else{

       let vendorValue = Object.values(this.payeevendor);

        this.paytrans.vendorPayeeName=vendorValue.toString();

        this._cashAdvance
        .updateCashRetirement(this.paytrans)
        .subscribe(() => {

          this.notify.info('Updated Successfully');
          this.paytrans = new CreatePaymentTransactionDto();
          this.loadCARetirement();
          this.payeevendor=null;
          this.paytrans.requestNumber=this.advno;
          this.getDetails();
          this.primengTableHelper.isLoading = false;

          this.payeevendor=null;
          //location.reload();
        });
      }

   }

        //payctransForm.resetForm();

  }


  submitRequest(){

    this.saving = true;
    this._cashAdvance
      .initiateCARRequest(this.paytrans.requestNumber)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((r) => {


        this.advno="";
      this.cAmount = 0;
      this.currencyRate = 1;
      this.currency = "";
      this.totalAmount = 0;
      this.totalValue = 0;
      this.paytrans = new CreatePaymentTransactionDto();
      this.loadCARetirement();
        this.loadTopStatsData();
        this.varAmtCal();
        this.getCAdvance();

        this.totalAmount = 0;
      this.isReady = true;
      this.endDate = null;
      this.notify.info(this.l('SavedSuccessfully'));
        this.message.success(this.l('SavedSuccessfully') + ' Ref: ' + r + ' and' + ' sent For approval');
        this.isPayeeSelected = false;
      });

      this.totalAmount = 0;
      this.sAmount = 0;
      this.aAmount = 0;
      this.supportingDocumentCount= 0;
      this.uploadCount = 0;
  }

  initiateRequest() {

    if((this.cAmount >0  && !this.isCardTransaction )){
      var amt = this.cAmount.toLocaleString();
      if(!amt.toLocaleString().includes(".")){
amt +=".00";
      }
      this.message.confirm(
        this.l('Have you attached a proof of reinburstment amount(' + amt.toLocaleString()  + ') to the companys account'),
        this.l('Attention'),
        isConfirmed => {
            if (isConfirmed) {
               this.submitRequest();
               this.cAmount = 0;
               amt ="0";
            }
        }
    );
    }else{

      if (this.sAmount>0 && !this.isCardTransaction){
        var samt = this.sAmount.toLocaleString();
        if(!samt.toLocaleString().includes(".")){
          samt +=".00";
                }
      this.message.confirm(
        this.l('This amount(' + samt.toLocaleString()  + ') will be credited to your account'),
        this.l('Attention'),
        isConfirmed => {
            if (isConfirmed) {
               this.submitRequest();
               samt = "0";
               this.sAmount = 0;
            }
        }


    );

      }else{


      this.message.confirm(
        this.l('Do you want to proceed with this transaction'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
               this.submitRequest();
               this.sAmount = 0;
               this.cAmount = 0;
               amt = "0";
               samt = "0";
            }
        }


    );

      }


    }


    this.totalAmount = 0;
    this.sAmount = 0;
  }

  async getDetails(){
    await this.getCDet();


  this.varAmtCal();
    this.getCNamee();
  this.advno=this.paytrans.requestNumber;
  this.loadCARetirement();
  this.getCardInvoice();
  this.getFundType();
   this.totalCountOfSupportingDocument();
    var itemlist = this.cashadvlist;

    var getItem =  itemlist.filter(x => x.requestNumber == this.paytrans.requestNumber);
    var tType = getItem[0].transactionTypeId;

 this._cashAdvance.getExpiryDate(this.paytrans.requestNumber).subscribe(x => {
   this.endDate =  x.toSQLDate();



 })
    this.currency = getItem[0].currency;
    this.currencyRate = 1;
    this.totalValue = getItem[0].amount;
this._operationService.getDefaultCurrency().subscribe(v => {
 this.currencyRate
  if (this.currency != v.currencyCode) {

    this._operationService.getCurrencyExchangeRateList().subscribe( c => {
      this.currencyRate = c.filter(d => d.exchangeCurrencyCode == this.currency)[0].exchangeRate;
      this.totalValue = this.currencyRate * getItem[0].amount;
    });




  }

})





  }
  async getCDet(){
    let ref =this.paytrans.requestNumber;
    //console.log(ref);
   this.aAmount = await this._cashAdvance.getAdvAmount(ref)
    .toPromise();



  }
  loadCARetirement() {

    this._cashAdvance.getCashRetirement(this.advno
    ).subscribe(result => {
          this.primengTableHelper.totalRecordsCount = result.length;
          if(this.primengTableHelper.totalRecordsCount > 0){
             this.saveButtonDisabled  = true;
             this.initiateButtonDisable = false;
             this.isPayeeSelected = true;
          }else{
             this.saveButtonDisabled =false;
            this.initiateButtonDisable = true;
            this.isPayeeSelected = false;
          }
      this.primengTableHelper.records = result;
      this.records = result;
          let sum  = result.reduce((sum,x) => sum + x.amount, 0 );
      this.totalAmount = sum;

    });



  }
  varAmtCal(){

    this.sAmount = 0;
      this.cAmount = 0;
    this._cashAdvance.sumARetired(this.paytrans.requestNumber).subscribe(result=>{
      this.totalAmount=result;


      if (this.aAmount>this.totalAmount){
        this.cAmount=this.aAmount - this.totalAmount;
        this.sAmount=0;
       // this.paytrans.amount=this.cAmount;
      }else{
          this.sAmount =this.totalAmount - this.aAmount;
        //  this.paytrans.amount=this.cAmount;
          this.cAmount=0;
        }

    })

  }

  cleardetail(){
    this.aAmount = 0;
    this.totalAmount = 0;
    this.sAmount = 0;
    this.cAmount = 0;

    this.totalValue = 0;
    this.CAType = '';
    this.currencyRate = 1;
this.currency = '';
  }


getFundType(){
 this.CAType = '';
this._cashAdvance.getFundType(this.paytrans.requestNumber)
.subscribe(item=>{
  this.CAType = 'Staff Transaction';
  this.isCardTransaction=item;
if (item) {
this.CAType = 'Card Transaction'

}

})
}
getCardInvoice(){
this._cashAdvance.getCardInvoice(this.paytrans.requestNumber)
.subscribe(item=>{
  this.cardGL=item
})
}

  //To validate maximum amount
  checkmaxamount(){}

  //To Disable save button if payeetypeid and payeename are different vendors
  checkifvaluematched(requestNumber: string, payeeName: string, transactionTypeId: number){

     this._cashAdvance.checkSameTransType(requestNumber, payeeName,transactionTypeId).subscribe(result =>{
       let resultvalue = result

      if(  resultvalue == true ){
        this.saveButtonDisabled  = false;
        console.log("yyyyyy");
        return this.saveButtonDisabled;


     }
      if(  resultvalue ==false  ){

            this._cashAdvance.isrecordexistforuser().subscribe(result => {

              let vvv = result

              if(vvv == false){
                this.saveButtonDisabled = false;
              }else{
                this.saveButtonDisabled = true;
              }
            })

     }
     })
  }
  add(id?: any) {
    //let id = 0;
    //this.taxTransactionModal.show(id);

    // this. taxtransprimengTableHelper.showLoadingIndicator();
    // this._cashAdvance.getTaxTransaction(id
    // ).pipe(finalize(() => this. taxtransprimengTableHelper.hideLoadingIndicator())).subscribe(result => {

    //   this.taxtransprimengTableHelper.records = result;

    //   this.taxtransprimengTableHelper.hideLoadingIndicator();
    //    console.log(result);

    // });

  }



  addsplitcost(id?: any, amt?: number,transactiontypeid?:any,period?:any) {
    //let id = 0;

   this.splitCostModal.show(id, amt,transactiontypeid,period );


    this.splitcostprimengTableHelper.showLoadingIndicator();
    // this._cashAdvance.getcasplitcostList(id
    // ).pipe(finalize(() => this.splitcostprimengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this._opex.getsplitcostList(id
        ).pipe(finalize(() => this.splitcostprimengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.splitcostprimengTableHelper.records = result;

      this.splitcostprimengTableHelper.hideLoadingIndicator();
       console.log(result);

    });

   }


   addworkflowroute(){





     //this.cashadvanceWorkflowRouteModal.show();
   }




  edit(f:CreatePaymentTransactionDto): void {


    this.paytrans.madeBy = f.madeBy;
    this.paytrans.id = f.id;
    this.paytrans.tenantId = f.tenantId;
    this.paytrans.narration = f.narration;
    this.paytrans.operationId = f.operationId;
    this.paytrans.payeeName = f.payeeName;
    this.paytrans.payeeTypeId = f.payeeTypeId;
    this.paytrans.requestDate = f.requestDate;
    this.paytrans.requestNumber = f.requestNumber;
    this.paytrans.taxAmount = f.taxAmount;
    this.paytrans.transactionTypeId = f.transactionTypeId;
    this.paytrans.whtAmount = f.whtAmount;
    this.paytrans.amount=f.amount;
    this.paytrans.truncateCardRequest = f.truncateCardRequest;


    this.payeevendor=f.vendorPayeeName ;


  }


  delete(d: CreatePaymentTransactionDto): void {
    this.message.confirm(
        this.l('Do you want to delete this record?'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._cashAdvance.deleteRetirementReq(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Deactivated'));
                    this.varAmtCal();
                    this.loadCARetirement();
                    this.paytrans = new CreatePaymentTransactionDto();

                   // this.paytrans.amount=this.totalAmount;
                    this.paytrans.requestNumber=null;
                    this.getDetails();
                    this.saving=false;
                 });
            }
        }
    );
  }

  varAmtCalevt($event){

 }

 loadTopStatsData() {
  this.primengTableHelper.isLoading = true;
  this._tenantDashboardServiceProxy.getWorkflowTopStats(this.OPID,0,0).pipe(
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

  // var totalcount= this.workflowData.filter(pendingworkflow=>pendingworkflow.opid===0);
  // totalcount.map(item => {

  //     this.totalCounter = item.numCount;
  //     this.totalworkflowAmount= item.amount;

  //   });
console.log(authorized);





  });


}
checkIfIsPayeeSelected(): boolean{
    var isSelect = false;



    return isSelect;

}


}


export interface VendorPayee{
   label:string;


}
