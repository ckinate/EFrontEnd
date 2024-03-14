
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostingDetailsComponent } from '@app/main/posting/posting-details.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BeneficiaryAccountProfilesServiceProxy, BeneficiaryAccountProfileDto, TypeOfPaymentStatus , FundingMasterDto, FundingDetailsDto,
  ChartOfAccountDto,DefaultAccountDetailsDto, ChartofAccountServiceServiceProxy, CurrencyDto, GeneralOperationsServiceServiceProxy,CashAdvanceServiceServiceProxy, OpexPaymentGridViewDto, OpexPaymentMasterDto, PaymentModeDto, PaymentTransactionDto, PostDto, PostItem, TransactionTypeDto, DefaultAccountDetailsServiceServiceProxy, OperatingExpenseServiceServiceProxy, TypeOfBeneficiary, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';
import { Listbox, SelectItem, Table } from 'primeng';
import { finalize } from 'rxjs/operators';



import { DateTime } from 'luxon';
import * as _ from 'lodash';
import { OpexquerymodalComponent } from '@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
import {BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ViewBeneficiaryTransactionAccountsComponent } from '@app/operation/view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { CashAdvanceworkflowtrailmodalComponent } from '@app/operation/cashadvance/cashadvancepaymentdetails/cashadvanceworkflowtrailmodal/cashadvanceworkflowtrailmodal.component';
import { info } from 'console';



@Component({
  selector: 'appcadModal',
  templateUrl: './cad.component.html',
  styles: [
  ]
})
export class CadComponent extends AppComponentBase implements OnInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('cadModal' , {static: true}) modal: ModalDirective;
  capaymentForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

  capayment:  OpexPaymentMasterDto = new OpexPaymentMasterDto();
  caDetail: OpexPaymentMasterDto[] = [];
    @ViewChild("fileUpload", { static: true }) fileUpload: FileuploadComponent;
    @ViewChild("opexquerymodal", { static: true })  opexquerymodal: OpexquerymodalComponent;

  @ViewChild("viewbeneficiary", { static: true })
  viewbeneficiary: ViewBeneficiaryTransactionAccountsComponent;

  cashadvanceUsersFilterReserved: PaymentTransactionDto[] = [];
  CASH_ADVANCE_OPERATION_ID = 20;
    cashAdvanceList: ChartOfAccountDto[] = [];
   paymentTransactionUsers: PaymentTransactionDto[] = [];
   paymentmode: PaymentModeDto[] = [];
   currencyList: CurrencyDto[] = [];
  records: OpexPaymentGridViewDto[] = [];
  saving = false;
  declinereason=false;
  dReason='';
  DeclineComment: string;
  modalRef: BsModalRef;
  username=20;
    startdate= new Date();
  hasDate = false;
  mindate : Date;
  BenRemark = '';
  selectedItem: OpexPaymentMasterDto[];
  filterText: any;
  newSelectedItem:OpexPaymentMasterDto [];
  chartOfAcct: ChartOfAccountDto[] = [];
  defchartOfAcct: ChartOfAccountDto[] = [];
  crName = '';
  drName = '';

  selectedGroup: any;
  //groups: any [] = [];
  groupList: SelectItem [] = [] ;

  @ViewChild('listBox') accessor: Listbox;
  @ViewChild('listBox', { read: NgModel }) model: NgModel;


   mainAmount: number;
   taxableamount: number;
   whtamount:number;
   taxamount:number;
     isReady = false;

  payee :any;
  refNo:any;
  ischecked = false;
  checkval=false;
  cId:number;
  paymentOptionNarration = ''
  isCardTransaction = false;
  amtCheck = 0;

  paymentButtonText ='Initiate Payment';

 @ViewChild('cashadvanceWorkflowTrailModal', { static: true }) cashadvanceWorkflowTrailModal: CashAdvanceworkflowtrailmodalComponent;
 @ViewChild('postdetails', { static: true }) postdetails: PostingDetailsComponent;


 hidetaxform = false;
 hidetaxationform = false;

 postItems: PostItem[] =[];
 itemPost: PostDto = new PostDto();
 iPost: PostItem = new PostItem();



 OtherDebitGL = '0';
 OtherCreditGL = '0';
 subtotal = 0;
  discount = 0;
  taxAmount = 0;
  totalAmount = 0;
  amountpaying = 0;

 cashBankGL = '0';
 advancegl = '0';
  ccc : any;
  taxvalue: any;
  whtvalue: any;
  reqNarration:string;
  sdate:string;
  miscode = '';
  misDescription = '';

  debitAccountProfile: BeneficiaryAccountProfileDto;
  creditAccountProfile: BeneficiaryAccountProfileDto;
  accountBalance = 0;
  creditGL: string;
  debitGL: string;
  supportingDocumentCount: any = 0;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _opex: CashAdvanceServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy,
    private _getCAcctDefault: DefaultAccountDetailsServiceServiceProxy,
    private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy,
    private _opexm: OperatingExpenseServiceServiceProxy,
    public datepipe: DatePipe,
    private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
    private modalService: BsModalService,
    private _service: DocumentServiceProxy
    ) {

      super(injector);
    }

  ngOnInit(): void {
    this.primengTableHelper.isLoading = true;
    this.saving = true;
this.capayment.pModeId = 1;
    this.getCaPaymentTransactionUser();
   // this.getCACurrency();
    this.cApayeementMode();
    this.loadCAChartofAccount();
    this.getCAccountDefault();
    this.getCAccountChartDefault();
    
    this.primengTableHelper.isLoading = false;
    this.paymentOptionNarration = '';
    this.saving = false;
  }

  ngAfterViewInit(): void {



  }

  viewBeneficiary() {
    if (this.refNo == null || this.refNo == undefined) {
    } else {
      if(!this.isCardTransaction){
        this.viewbeneficiary.show(this.refNo, "CashAdvance");
      }else{
        this.message.info("Viewing of beneficies not enabled for card transactions!","Notice");
      }

    }
}

totalCountOfSupportingDocument(){
 
   
  this._service.getFilesByParentRef(this.refNo).subscribe(x=>{
    this.supportingDocumentCount  = x.length;
    
  })

}
ShowAttachFileDocument(id: any, OPID: number){
  id = this.refNo;

  this.fileUpload.ShowAttachmentByParentRef(id);


 }

  getCaPaymentTransactionUser() {
    this.showMainSpinner();

    this._opex.getCAPaymentUserList().pipe(finalize(()=>{
      this.hideMainSpinner();
    })).subscribe(items => {
        this.paymentTransactionUsers = items;
        this.cashadvanceUsersFilterReserved=items;

      });




  }
  getpaymentbysearch() {
    var search = this.filterText;
    this.paymentTransactionUsers = this.paymentTransactionUsers.filter(
        (m) =>
            m.amount == search ||
             
            m.requestNumber.toLowerCase() == search.toLowerCase()
    );
}



  cApayeementMode(){

    this._opex.getCAPaymentModeList()
      .subscribe(items => {
        this.paymentmode = items;



      });
  }
  getCACurrency(){

    this._operationService.getCurrencyList()
      .subscribe(items => {
        this.currencyList = items;

        this.capayment.currency='NGN';
      });
  }

  loadCAChartofAccount(){

    this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
      this.chartOfAcct = r;

    });
  }

getCAccountDefault(){
   this._getCAcctDefault.getDefaultAccountListByCode('011')
  .subscribe(items => {
    this.cashAdvanceList = items;

    if(this.cashAdvanceList.length==0){
      this.message.warn("Account to debit not maintained, please contact Admin");
    }


  });
  }

getCAccountChartDefault(){


  this._opexm.getCashAndBankAccount()
  .subscribe(items => {
    this.defchartOfAcct = items;
    this.capayment.creditGL = items[0].accountCode;
    this.creditGL = items[0].accountCode;
    this.crName = items[0].accountName;
    if(this.defchartOfAcct.length==0){
      this.message.warn("Account to credit not maintained, please contact Admin");
      this.close();
    }

  });
}

  getcapaymentGridView(payeeName?: string,refNo?:string){

    this.payee = payeeName;
    this.refNo = refNo;
    this.saving = true;
    this.getReqNarration(refNo, () => {
      this._opex.cashadvancePaymentGrid(payeeName,refNo
        ).pipe(
          finalize(() => {
              this.saving = false;

          })
      ).subscribe(result =>{
        this.records= result;

        if(result[0].madeBy != this.appSession.user.userName)
        {
        this.records.forEach(cc=>{

          this.taxableamount = cc.taxableAmount;
          this.taxamount = cc.tax;
          this.whtamount = cc.wht;
          this.capayment.taxAmount =this.taxAmount ;
          this.capayment.whtAmount =this.whtamount ;
          this.totalAmount =cc.amount;
          this.isCardTransaction = cc.applyPrepayment;
          this.paymentOptionNarration = 'Fund Staff Account';
          this.capayment.debitGL ='';
          this.amtCheck = cc.amount;
          this.miscode = cc.misCode;
          this.capayment.debitGL = this.cashAdvanceList[0].accountCode;
          this.capayment.creditGL = this.defchartOfAcct[0].accountCode;
          this.creditGL = this.defchartOfAcct[0].accountCode;

          this.drName = this.cashAdvanceList[0].accountName;
          this.crName = this.defchartOfAcct[0].accountName;

          this.misDescription = cc.misCodeDescription
          if (cc.applyPrepayment) {
          this.paymentOptionNarration = 'Fund Card Account';
          this.capayment.debitGL = cc.invoiceNumber;

          }
        })

        this.capayment.grossAmt
        this.capayment.ledgerRemark=this.reqNarration;
        this.capayment.remark=this.reqNarration;
        this.BenRemark=this.reqNarration;
      }else{
        this.message.warn("You cannot process your own transaction.","Notification");

        this.payee = '';
        this.refNo = '';
        this.close();

      }
       });
    });
  }

  getReqNarration(ref:string, callback = () => {}){
    this._opex.getNarration(ref).subscribe(x=>{
    this.reqNarration=x;
    callback()
    })
  }


  checkCreditGLSelected():void{

     this.saving = true;
    this.creditGL = this.capayment.creditGL;
    this._opexm.getAccountBalance(this.creditGL).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe(x => {
      this.accountBalance = x;
    });
    this.crName = this.defchartOfAcct.filter(x => x.accountCode == this.creditGL)[0].accountName;
  }

  checkDebitGLSelected():void{
    this.debitGL = this.capayment.debitGL;


    this.drName = this.cashAdvanceList.filter(x => x.accountCode == this.debitGL)[0].accountName;
  }



  ReloadpaymentGridView(events) {

    var event = events;
    let opSearch = this.cashadvanceUsersFilterReserved;
    var iss = opSearch.filter(function (x) {
        return (
            x.amount.toString().includes(event.toLowerCase()) ||
            x.requestNumber.toLowerCase().includes(event.toLowerCase()) ||
            x.payeeName.toLowerCase().includes(event.toLowerCase())
        );
    });

    this.paymentTransactionUsers = iss;
}


getPostingDetails() {


 this.itemPost = new PostDto();

 this.itemPost.transactionStatusId = 1;
 this.itemPost.transactionType = 19;
 this.itemPost.currencyId = this.cId;
 this.itemPost.valueDate = DateTime.local(
    this.startdate.getFullYear(),
    this.startdate.getMonth(),
    this.startdate.getDay()
);

 let dr = new PostItem();
  dr.accountCode = this.capayment.debitGL;
  dr.beneficiaryNarration = this.BenRemark;
  dr.accountName = this.drName;
  dr.creditAmount = 0;
  dr.debitAmount =  this.totalAmount;
  dr.narration = this.reqNarration;

  let cr = new PostItem();
  cr.accountCode = this.capayment.debitGL;
  cr.beneficiaryNarration = this.BenRemark;
  cr.creditAmount = this.totalAmount
  cr.debitAmount =  0;
  cr.accountName = this.crName;
  cr.narration = this.reqNarration;
  this.postItems.push(cr);
  this.postItems.push(dr);
  this.itemPost.postItem = this.postItems;


}


  save( capaymentForm?: NgForm) {

if(this.accountBalance >= this.totalAmount )

{

if (this.capayment.creditGL == this.capayment.debitGL) {


  this.message.error("Debit account cannot be same as Credit account " + this.capayment.creditGL, "Wrong Account Selection");




}
else {


if (this.totalAmount>this.amtCheck) {

  this.notify.error("Inputed Amount cannot be greater than amount initiated!","Invalid Transaction", {timer: 5000, toast: true, position: 'top-end'});
} else {

      var self = this;
      var startDate = this.startdate;
      this.capayment.amountNowPaid = this.totalAmount;
//this.getPostingDetails();

this.getAdvancePostingDetails(this.totalAmount);

  self.saving = true;
        self._beneficiaryAccountProfilesServiceProxy.getUserAccountProfile(
          TypeOfBeneficiary.GL,
          self.creditGL
        ).subscribe(record2 => {
               // if (_.isEmpty(record2)) {
          //   self.message.error(self.l("This GL does not have an account profile"));
          //   self.saving = false;
          //   return;
          // } else {



          // }
          self.debitAccountProfile = record2;

          if(self.capayment.pModeId == null){
            self.capayment.pModeId=1;
          }

          if(self.capayment.currency===null){
            self.capayment.currency="NGN";
          }


         // self.capayment.debitGL = self.debitGL;
          self.capayment.creditGL = self.creditGL;
          self.capayment.tenantId = abp.session.tenantId;
          self.capayment.payeeName = self.payee;
          self.capayment.pDate= DateTime.fromJSDate(startDate);
          self.capayment.pRefNo=self.refNo;

          self.capayment.amountNowPaid = this.totalAmount;

          self._opex.createCashAdvancePaymentMaster(self.capayment)
          .pipe(
            finalize(() => {
              self.saving = false;
            })
          )
          .subscribe((r) => {

           this.message.success(  this.l("SavedSuccessfully") + " Ref: " + r )
           this.close();
            this.modalSave.emit(r);
            self.selectedItem = [];
           // self.getcapaymentGridView(self.payee, self.refNo);
            self.ischecked = false;
            self.taxvalue = 0;
            self.whtvalue = 0;
            self.subtotal = 0;
            self.mainAmount = 0;
            self.checkval=false;
            self.capayment = new OpexPaymentMasterDto();
            self.getCaPaymentTransactionUser();
            capaymentForm.reset();
            self.saving = false;
            self.refNo = '';
            self.reqNarration='';
            self.startdate= new Date();

            this.capayment.ledgerRemark = '';
            this.capayment.remark = '';
            this.BenRemark = '';
            self.paymentOptionNarration = '';
            self.reqNarration = '';
            this.getCACurrency();


          });


        });


      }

    }
  }
  else{    
    this.message.info("Insufficient fund!","Payment transaction");
  }
    this.capayment.currency='NGN';
  }



getCurrencyId(){
  this._opexm.currencyId(this.capayment.currency).subscribe((x)=>{
    this.cId=x;

    console.log(x);

  });
}


preview() {
  if(!this.isCardTransaction){
    debugger;
  this.getAdvancePostingDetails(this.capayment.grossAmt);
  this.postdetails.showprepostDetails(this.capayment.postingDetails, this.refNo);
  }else{
    this.message.info("Preview not enabled for card transactions!","Notice");
  }
}

decline( capaymentForm?: NgForm) {

    this.saving = true;

              this._opex.declineAdvanceFinance(this.refNo, this.dReason)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe((r) => {

               this.message.success(  this.l("Decline successfully") )

                this.selectedItem = [];
                this.getcapaymentGridView(this.payee, this.refNo);
                this.ischecked = false;
                this.taxvalue = 0;
                this.whtvalue = 0;
                this.subtotal = 0;
                this.mainAmount = 0;
                this.checkval=false;
                this.capayment = new OpexPaymentMasterDto();
                this.getCaPaymentTransactionUser();
                capaymentForm.reset();
                this.saving = false;
                this.refNo = '';
                this.reqNarration='';
                this.startdate= new Date();
                this.capayment.currency='NGN';

              });


    }

declinersn(){
this.declinereason=true;
}
  deleterequest() {
        // var text = prompt("Please enter your reason for decline", "");
        // if (text == null || text == ""){
        //     //console.log("No");
        //     return;
        // }
        // else{
          if (this.DeclineComment == null || this.DeclineComment == "") {
            return;
          } else {
            if (this.refNo == null || this.refNo == undefined) {
            } else {
                this.modalRef.hide()
                this.message.confirm(
                    this.l("Do you want to proceed?"),
                    this.l(
                        "Please, You have just clicked to terminate this transaction with Reference No:" +' '+ this.refNo +
                        "\n" +
                        "Reason:" +
                        " " +
                        this.DeclineComment +
                        "."
                    ),
                    (isConfirmed) => {
                        if (isConfirmed) {
                          this._opex.declineAdvanceFinance(this.refNo, this.DeclineComment)
                          .subscribe(() => {
                                this.notify.success(
                                    this.l("Transaction terminated successfully")
                                );
                                this.DeclineComment = '';
                                this.close();
                                this.modalSave.emit();

                                this.ngOnInit();
                            });

                        } else {
                          this.DeclineComment = null;
                        }
                    }
                );
            }
        }
    }

getAdvancePostingDetails(amt: number) {

    let pIt = new PostDto();
    this.postItems = [];
  this.iPost = new PostItem();
  this.iPost.accountCode =  this.capayment.creditGL;
  this.iPost.beneficiaryCode = this.capayment.id;
  this.iPost.creditAmount = this.totalAmount;
  this.iPost.debitAmount = 0;
  this.iPost.narration = this.refNo + ' - ' + this.capayment.ledgerRemark;
  this.iPost.reportCode = this.miscode;
  this.iPost.reportCodeDescription = this.misDescription;
  this.iPost.accountName = this.crName;
  this.postItems.push(this.iPost);

  this.iPost = new PostItem();
  this.iPost.accountCode = this.capayment.debitGL;
  this.iPost.accountName = this.drName;
  this.iPost.beneficiaryCode = ''// this.customerDetails.id.toString();
  this.iPost.creditAmount = 0;
  this.iPost.debitAmount = this.totalAmount;
  this.iPost.narration =  this.refNo + ' - ' + this.capayment.ledgerRemark;
  this.iPost.reportCode = this.miscode;
  this.iPost.reportCodeDescription = this.misDescription;

  this.postItems.push(this.iPost);

  pIt.transactionStatusId = 1;
  pIt.transactionType =20;
  if (this.capayment.pModeId !== 1) {
    pIt.transactionType =64;
  }

  pIt.currencyId = this.cId;
  pIt.valueDate =DateTime.fromJSDate(this.startdate); //this.carpayment.pDate;
  pIt.tenantId = this.appSession.tenantId;
  pIt.postItem = this.postItems;
  pIt.ref = '';

  this.capayment.postingDetails = pIt;


  }


  createquery() {
    this.opexquerymodal.show(this.refNo, this.username, this.payee,this.capayment.operationId);
}
openModal(template: TemplateRef<any>) {
  const config: ModalOptions = {
      class: 'modal-dialog-centered'
  };
  this.modalRef = this.modalService.show(template, config);
}
oncontinue(): void {

}

  show(opid: any, refNo: any, madeby: any): void {

    this.capayment.pModeId = 1;
    this.capayment.operationId = 20;

    
    this.getcapaymentGridView(madeby, refNo);
    this.totalCountOfSupportingDocument();
    this.checkCreditGLSelected();
    this.getCACurrency();
    this.totalCountOfSupportingDocument();
    this.modal.show();
  }

  onShown(): void {

  }
  close(): void {

      this.modal.hide();
  }


}
