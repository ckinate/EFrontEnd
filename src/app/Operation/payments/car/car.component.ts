import { debugOutputAstAsTypeScript } from "@angular/compiler";
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { PostingDetailsComponent } from "@app/main/posting/posting-details.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
//import { ChartOfAccountDto, ChartofAccountServiceServiceProxy,  CurrencyDto, GeneralOperationsServiceServiceProxy, OperatingExpenseServiceServiceProxy, OpexPaymentDetailDto, carpaymentGridViewDto,, OpexPaymentMasterDto, PaymentModeDto, PaymentTransactionDto, PostDto, PostItem, TransactionTypeDto } from '@shared/service-proxies/service-proxies';
import {
    TypeOfBeneficiary,
    BeneficiaryAccountProfilesServiceProxy,
    BeneficiaryAccountProfileDto,
    TypeOfPaymentStatus,
    FundingMasterDto,
    FundingDetailsDto,
    ChartOfAccountDto,
    DefaultAccountDetailsDto,
    ChartofAccountServiceServiceProxy,
    CurrencyDto,
    GeneralOperationsServiceServiceProxy,
    CashRetirementServiceServiceProxy,
    OpexPaymentGridViewDto,
    OpexPaymentMasterDto,
    PaymentModeDto,
    PaymentTransactionDto,
    PostDto,
    PostItem,
    TransactionTypeDto,
    DefaultAccountDetailsServiceServiceProxy,
    OperatingExpenseServiceServiceProxy,
    DocumentServiceProxy,
} from "@shared/service-proxies/service-proxies";

import * as moment from "moment";
import { Listbox, SelectItem, Table } from "primeng";
import { finalize } from "rxjs/operators";

import { DateTime } from "luxon";
import { DocumentsComponent } from "@app/operation/documents/documents.component";
import * as _ from "lodash";
import { OpexquerymodalComponent } from "@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Console, timeStamp } from "console";
import { ViewBeneficiaryTransactionAccountsComponent } from "@app/operation/view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component";
import { FileuploadComponent } from "@app/operation/FileDocuments/fileupload/fileupload.component";


import { ModalDirective } from 'ngx-bootstrap/modal';
import { CASplitcostviewmodalComponent } from "@app/operation/cashadvance/cashretirementpaymentdetails/casplitcostviewmodal/casplitcostviewmodal.component";

@Component({
  selector: 'appcarModal',
  templateUrl: './car.component.html',
  styles: [
  ]
})
export class CarComponent extends AppComponentBase implements OnInit {
  @ViewChild('carModal' , {static: true}) modal: ModalDirective;
  @Output() modalSaveR: EventEmitter<any> = new EventEmitter<any>();
  carpaymentForm: NgForm;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();

    carpayment: OpexPaymentMasterDto = new OpexPaymentMasterDto();
    carpaymentDet: OpexPaymentMasterDto = new OpexPaymentMasterDto();
    caDetail: OpexPaymentMasterDto[] = [];
    @ViewChild("fileUpload", { static: true })
    appdocuments: FileuploadComponent;
    @ViewChild("caSplitCostViewModal", { static: true })
    caSplitCostViewModal: CASplitcostviewmodalComponent;

    @ViewChild("opexquerymodal", { static: true })
    opexquerymodal: OpexquerymodalComponent;
    @ViewChild("viewbeneficiary", { static: true })
    viewbeneficiary: ViewBeneficiaryTransactionAccountsComponent;
    CASH_RETIREMENT_PAYMENT_OPERATION_ID = 22;
        cashAdvanceList: ChartOfAccountDto[] = [];
    paymentTransactionUsers: PaymentTransactionDto[] = [];
    cashretirementUsersFilterReserved: PaymentTransactionDto[] = [];
    paymentmode: PaymentModeDto[] = [];
    currency: CurrencyDto[] = [];
    records: OpexPaymentGridViewDto[] = [];
    saving = false;
    startdate = new Date();
    hasDate = false;
    mindate: Date;
    BenRemark = "";
    DeclineComment: string;
    username = 22;
    CashAdvanceGL = "";
    CashAndBankGL = "";
    selectedItem: OpexPaymentMasterDto[];

    newSelectedItem: OpexPaymentMasterDto[];
    chartOfAcct: ChartOfAccountDto[] = [];
    defchartOfAcct: ChartOfAccountDto[] = [];
    transactionRef = '';
    isPaymentModeNotRequired = false;

    selectedGroup: any;
    accountBalance = 0;

    groupList: SelectItem[] = [];

    @ViewChild("listBox") accessor: Listbox;
    @ViewChild("listBox", { read: NgModel }) model: NgModel;

    editExchangeRate = false;
    defaultCurrencyCode = "";
    currencyRate = 1;
    totalValue = 1;
    mainAmount: number;
    taxableamount: number;
    whtamount: number;
    taxamount: number;
    isReady = false;

    payee: any;
    refNo: any;
    ischecked = false;
    checkval = false;
    paymentOptionNarration = "";
    isCardTransaction = false;
    filterText: any;

    @ViewChild("postdetails", { static: true })
    postdetails: PostingDetailsComponent;

    hidetaxform = false;
    hidetaxationform = false;

    postItems: PostItem[] = [];
    itemPost: PostDto = new PostDto();
    iPost: PostItem = new PostItem();

    OtherDebitGL = "0";
    OtherCreditGL = "0";
    subtotal = 0;
    discount = 0;
    taxAmount = 0;
    totalAmount = 0;
    amountpaying = 0;

    cashBankGL = "0";
    advancegl = "0";
    ccc: any;
    taxvalue: any;
    whtvalue: any;
    amtadvanced = 0;
    amtretired = 0;
    samount = 0;
    camount = 0;
    reqNarration: string;

    debitAccountProfile: BeneficiaryAccountProfileDto;
    creditAccountProfile: BeneficiaryAccountProfileDto;

    creditGL: string;
    debitGL: string;
    paymentRef = '';
    cId: number;
    modalRef: BsModalRef;

    AdvancetransactionRef = '';
    AdvanceNarration = '';
    misCodeDescription = '';
    misCode = '';
    disableCashAdvanceGL = false;
    cardGLs: ChartOfAccountDto[] = [];
    OPID = 0;
    OperationId : any;

    uploadCount: any = 0;
supportingDocumentCount: any = 0;

    constructor(
        injector: Injector,
        private _getChartOfAcct: ChartofAccountServiceServiceProxy,
        private _opex: CashRetirementServiceServiceProxy,
        private _operationService: GeneralOperationsServiceServiceProxy,
        private _getCAcctDefault: DefaultAccountDetailsServiceServiceProxy,
        private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy,
        private _opexm: OperatingExpenseServiceServiceProxy,
        private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
        private modalService: BsModalService,
        private _service: DocumentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.primengTableHelper.isLoading = true;
        this.saving = true;
        this.startdate = new Date();
        this.getCaRPaymentTransactionUser();
        //this.gettransactionType();
        this.getCARCurrency();
        this.cARpayeementMode();
        this.loadCARChartofAccount();
        this.getCRAccountDefault();
        this.getCRAccountChartDefault();
        
        this.records = [];

        this.paymentOptionNarration = "";

        this.primengTableHelper.isLoading = false;
        this.saving = false;

        this._operationService.getDefaultCurrency().subscribe((x) => {
            this.carpayment.currency = x.currencyCode;
            this.defaultCurrencyCode = x.currencyCode;
        });
    }

    ngAfterViewInit(): void {}

    viewBeneficiary() {
        if (this.refNo == null || this.refNo == undefined) {
        } else {
            this.viewbeneficiary.show(this.refNo, "CashAdvance");
        }
    }

    totalCountOfSupportingDocument(){
 
        this._service.getFilesByParentRef(this.refNo).subscribe(x=>{
            this.supportingDocumentCount  = x.length;
            
          })
      
    }
    
    showDocument(id: any, OPID: number) {
    //    this.appdocuments.ShowAttachmentByRef(id, this.OperationId);
        this.OperationId

        console.log("The OperationID is -" + "" + "" + OPID);

        id = this.refNo;
//   this._opexm.getPaymentNo(id).subscribe((res)=>{
//       let pref = res;
//       this.appdocuments.ShowAttachmentByRefOnly(pref);
//       console.log(pref);
//   })

    this.appdocuments.ShowAttachmentByParentRef(id);
    }

    getCaRPaymentTransactionUser() {
        this._opex.getCARPaymentUserList().subscribe((items) => {
            this.paymentTransactionUsers = items;
            this.cashretirementUsersFilterReserved=items;
        });
    }

    getAdvamount(ref: string, callback = () => {}) {
        //let ref =this.carpaymentDet.pRefNo;
        //console.log(ref);
        this._opex.getAdvAmount(ref).subscribe((items) => {
            this.amtadvanced = items;
            callback();
        });
    }
    getRetamount(ref: string, callback = () => {}) {
        //let ref =this.carpaymentDet.pRefNo;
        //console.log(ref);
        this._opex.sumARetired(ref).subscribe((items) => {
            this.amtretired = items;
            console.log(this.amtretired);
            callback();
        });
    }

    cARpayeementMode() {
        this._opex.getCARPaymentModeList().subscribe((items) => {
            this.paymentmode = items;
        });
    }
    getCARCurrency() {
        this._operationService.getCurrencyList().subscribe((items) => {
            this.currency = items;
            console.log(this.currency);
        });
    }

    loadCARChartofAccount() {
        this._getChartOfAcct.getListChartOfAccounts().subscribe((r) => {
            this.chartOfAcct = r;
        });
    }


getCardGLs(){


    this._getChartOfAcct.getListChartOfAccounts().subscribe((r) => {
        this.cashAdvanceList = r;
        if(this.cashAdvanceList.length==0){
            this.message.warn("Credit advance GL not maintained, please contact Admin");
            this.close();
        }

    });
}

    getCRAccountDefault() {



        this._getCAcctDefault
            .getDefaultAccountListByCode("011")
            .subscribe((items) => {
                this.cashAdvanceList = items;
            });

    }

    getCRAccountChartDefault() {
        this._opexm.getCashAndBankAccount().subscribe((items) => {

            this.defchartOfAcct = items;
            this.CashAndBankGL = items[0].accountCode;

            if(this.defchartOfAcct.length==0){
                this.message.warn("Debit GL not maintained please contact Admin");
                this.close();
            }
        });
    }


    ReloadpaymentGridView(events) {

        var event = events;
        let opSearch = this.cashretirementUsersFilterReserved;
        var iss = opSearch.filter(function (x) {
            return (
                x.amount.toString().includes(event.toLowerCase()) ||
                x.requestNumber.toLowerCase().includes(event.toLowerCase())
                //  || x.payeeId.toLowerCase().includes(event.toLowerCase())
            );
        });

        this.paymentTransactionUsers = iss;



    }

    getpaymentbysearch() {
        var search = this.filterText;
        this.paymentTransactionUsers = this.paymentTransactionUsers.filter(
            (m) =>
                m.amount == search ||
                m.payeeId.toLowerCase() == search.toLowerCase() ||
                m.requestNumber.toLowerCase() == search.toLowerCase()
        );
    }

    getRequestDetails(payeeName, refNo){

      this.primengTableHelper.isLoading = true;
      this._opex
      .cashRetirementPaymentGrid(payeeName, refNo)
      .pipe(
        finalize(() => {
          this.primengTableHelper.isLoading = false;

        })
    )
      .subscribe((result) => {
          this.records = result;
        console.log(result);
          this.records.forEach((cc) => {
              this.AdvancetransactionRef = cc.advanceTransactionRef;
              this.AdvanceNarration = cc.advanceTransactionNarration;
              this.misCode = cc.misCode;
              this.misCodeDescription = cc.misCodeDescription;
              this.taxableamount = cc.taxableAmount;
              this.taxamount = cc.tax;
              this.whtamount = cc.wht;
              this.carpayment.taxAmount = this.taxAmount;
              this.carpayment.whtAmount = this.whtamount;
              this.isCardTransaction = cc.applyPrepayment;
              this.isPaymentModeNotRequired= cc.applyPrepayment;
              this.paymentOptionNarration =
                  "Staff Transaction";
              this.carpayment.currency = cc.currency;
              this.carpayment.debitGL = "";
              if (this.amtadvanced > this.amtretired) {
                  this.camount =
                      this.amtadvanced - this.amtretired;
                  this.samount = 0;
              } else {
                  this.samount =
                      this.amtretired - this.amtadvanced;
                  this.camount = 0;
              }

              if (this.amtretired < this.amtadvanced || this.isCardTransaction || this.amtretired== this.amtadvanced ) {
                this.isPaymentModeNotRequired =  true;
              }
              this.currencyRate = 1;
              this.editExchangeRate = false;
              this.CashAdvanceGL = cc.invoiceNumber;

              if (cc.applyPrepayment) {
                  this.paymentOptionNarration =
                      "Card Transaction";
                  this.carpayment.creditGL = cc.invoiceNumber;
              }
              if (this.defaultCurrencyCode != cc.currency) {
                  this._operationService
                      .getCurrencyExchangeRateList()
                      .subscribe((x) => {

                          var rt = x.filter(
                              (u) =>
                                  u.exchangeCurrencyCode ==
                                  cc.currency
                          );


                          this.currencyRate =
                              rt[0].exchangeRate;
                          this.editExchangeRate = true;


                      });
              } else {

              }

          });
          this.exchangeRateValue();
          this.carpayment.grossAmt;
          this.carpayment.ledgerRemark =this.reqNarration ;
          this.carpayment.remark = this.reqNarration;
          this.BenRemark = this.reqNarration;
          this.primengTableHelper.isLoading = false;
          this.CashAndBankGL = this.defchartOfAcct[0].accountCode;

          this._opex.getAdvancePaymentRef(this.refNo).subscribe((x) => {
          this.paymentRef =    x;
        });

      });
    }

    getcarpaymentGridView(payeeName?: string, refNo?: string) {
        if (this.refNo === refNo) return;

        this.primengTableHelper.isLoading = true;
        this.payee = payeeName;
        this.refNo = refNo;

        this.getAdvamount(refNo, () =>
            this.getRetamount(refNo, () =>
                this.getReqNarration(refNo, () => {
                    this._opex
                        .cashRetirementPaymentGrid(payeeName, refNo) .pipe(
                          finalize(() => {
                              this.primengTableHelper.isLoading = false;
                          })
                      )
                        .subscribe((result) => {
                            this.records = result;


                            
        if(result[0].madeBy != this.appSession.user.userName)
        {
                           
                            this.records.forEach((cc) => {
                                this.AdvancetransactionRef = cc.advanceTransactionRef;
                                this.AdvanceNarration = cc.advanceTransactionNarration;
                                this.misCode = cc.misCode;
                                this.misCodeDescription = cc.misCodeDescription;
                                this.taxableamount = cc.taxableAmount;
                                this.taxamount = cc.tax;
                                this.whtamount = cc.wht;
                                this.carpayment.taxAmount = this.taxAmount;
                                this.carpayment.whtAmount = this.whtamount;
                                this.isCardTransaction = cc.applyPrepayment;
                                this.paymentOptionNarration =
                                    "Staff Transaction";
                                this.carpayment.currency = cc.currency;
                                this.carpayment.debitGL = "";
                                this.isPaymentModeNotRequired = true;
                                if (this.amtadvanced > this.amtretired) {
                                    this.camount =
                                        this.amtadvanced - this.amtretired;
                                    this.samount = 0;
                                } else {
                                    this.samount =
                                        this.amtretired - this.amtadvanced;
                                    this.camount = 0;
if (this.samount > 0) {
    this.isPaymentModeNotRequired = false;
    this.carpayment.pModeId = this.paymentmode[1].id;
    
}

                                  
                                }
                                this.currencyRate = 1;
                                
                                this.editExchangeRate = false;
                                this.CashAdvanceGL = cc.invoiceNumber;
                                if (cc.applyPrepayment) {
                                    this.paymentOptionNarration =
                                        "Card Transaction";
                                    this.carpayment.creditGL = cc.invoiceNumber;
                                    this.disableCashAdvanceGL = true;
                                    this.isCardTransaction = true;
                                    this.carpayment.pModeId = 0;
                                    this.AdvancetransactionRef = '';
                                    this.isPaymentModeNotRequired = true;


                                }
                                if (this.defaultCurrencyCode != cc.currency) {
                                    this._operationService
                                        .getCurrencyExchangeRateList()
                                        .subscribe((x) => {

                                            var rt = x.filter(
                                                (u) =>
                                                    u.exchangeCurrencyCode ==
                                                    cc.currency
                                            );


                                            this.currencyRate =
                                                rt[0].exchangeRate;
                                            this.editExchangeRate = true;


                                        });
                                } else {

                                }


                            });

                            this.carpayment.grossAmt;
                            this.carpayment.ledgerRemark =this.reqNarration ;
                            this.carpayment.remark = this.reqNarration;
                            this.BenRemark = this.reqNarration;
                            this.exchangeRateValue();

                            this.primengTableHelper.isLoading = false;
                            this.CashAndBankGL = this.defchartOfAcct[0].accountCode;
                            if (!this.isCardTransaction) {
                                this._opex.getAdvancePaymentRef(this.refNo).subscribe((x) => {
                                    this.paymentRef =    x;
                                  });
                            }


                        }else{
                            this.message.warn("You cannot process your own transaction.","Notification");
                    
                            this.payee = '';
                            this.refNo = '';
                            this.close();
                    
                          }


                        });
                })
            )
        );
    }
    getReqNarration(ref: string, callback = () => {}) {
        this._opex.getrNarration(ref).subscribe((x) => {
            this.reqNarration = x;
            callback();
        });
    }
    calculatedAmountNowPaying(taxableAmount: number, tax: number, wht: number) {
        // amount + (tax * taxable amount/100) - (wht * taxable amount/100) = Amount payin

        this.taxAmount = tax;
        this.whtamount = wht;

     
        this.taxvalue = +tax * +(taxableAmount / 100);
        this.ccc = +this.amountpaying + +this.taxvalue;
        this.whtvalue = +wht * +(taxableAmount / 100);
        this.mainAmount = this.ccc - this.whtvalue;
        this.carpayment.amountNowPaid = this.mainAmount;

        
    }


    makepayment() {
        let ar = [];

        this.selectedItem.forEach((mm) => {
            let workflowitemList = new OpexPaymentMasterDto();

            let o = {
                id: mm.id,
                pMadeBy: mm.pMadeBy,
                amountNowPaid: this.carpayment.amountNowPaid,
                grossAmt: mm.grossAmt,
                pRefNo: mm.pRefNo,
                transactiontypeGl: this.carpayment.transactiontypeGl,
                //'currencyCodeId': this.carpayment.currencyCodeId,
                currency: this.carpayment.currency,
                pModeId: this.carpayment.pModeId,
                pDate: DateTime.fromJSDate(this.startdate), //this.carpayment.pDate,
                taxableAmount: mm.taxableAmount,
                whtgl: mm.whtgl,
                taxAmount: mm.taxAmount,
                whtAmount: mm.whtAmount,
                payeeName: mm.payeeName,
                invoiceNumber: mm.invoiceNumber,
                creditGL: this.carpayment.creditGL,
            };

            // this.newSelectedItem.push(o as WorkflowActionDto);
            ar.push(o);
        }); //end of forEAch...

        this.newSelectedItem = ar; //assign as newSelectedItem.

        this.save();
    } //end of approveWorkFlow...

    saveToFunds(amount, refNo, currency) {
        if (this.samount <= 0) {
            this.notify.info(
                "Fund Transfer Intiated Successfully",
                "Funds would be initiated immediately"
            );
            this.message.info(this.l("SavedSuccessfully") + " Ref: " + refNo);
            return;
        }

        var creditDetails = new FundingDetailsDto();
        creditDetails.bankCode = this.creditAccountProfile.bankCode;
        creditDetails.beneficiaryCode = this.creditAccountProfile.beneficiaryCode;
        creditDetails.beneficiaryName = this.creditAccountProfile.beneficiaryName;
        creditDetails.beneficiaryType = this.creditAccountProfile.beneficiaryType;
        creditDetails.isDebit = false;
        creditDetails.isPosted = false;
        creditDetails.amount = String(this.samount);
        creditDetails.refNo = refNo;
        creditDetails.bankAccountNumber = this.creditAccountProfile.beneficiaryAccountNumber;

        var debitDetails = new FundingDetailsDto();
        debitDetails.bankCode = this.debitAccountProfile.bankCode;
        debitDetails.beneficiaryCode = this.debitAccountProfile.beneficiaryCode;
        debitDetails.beneficiaryName = this.debitAccountProfile.beneficiaryName;
        debitDetails.beneficiaryType = this.debitAccountProfile.beneficiaryType;
        debitDetails.isDebit = true;
        debitDetails.refNo = refNo;
        debitDetails.isPosted = false;
        debitDetails.bankAccountNumber = this.debitAccountProfile.beneficiaryAccountNumber;

        var masterDebit = new FundingMasterDto();
        masterDebit.coycode = this.getCompanyCode();
        masterDebit.tenantId = abp.session.tenantId;
        masterDebit.refNo = refNo;
        masterDebit.currency = currency;
        masterDebit.operationId = this.CASH_RETIREMENT_PAYMENT_OPERATION_ID;
        masterDebit.postingStatus = TypeOfPaymentStatus.Initiated;
        masterDebit.fundingDetailsDto = debitDetails;

        var masterCredit = new FundingMasterDto();
        masterCredit.coycode = this.getCompanyCode();
        masterCredit.tenantId = abp.session.tenantId;
        masterCredit.refNo = refNo;
        masterCredit.currency = currency;
        masterCredit.operationId = this.CASH_RETIREMENT_PAYMENT_OPERATION_ID;
        masterCredit.postingStatus = TypeOfPaymentStatus.Initiated;
        masterCredit.fundingDetailsDto = creditDetails;

        var item: FundingMasterDto[] = [masterDebit, masterCredit];

        this._beneficiaryAccountProfilesServiceProxy
            .save(item)
            .subscribe((result) => {
                console.log(result);
                this.notify.info(
                    "Fund Transfer Intiated Successfully",
                    "Funds would be initiated immediately"
                );
                this.message.info(
                    this.l("SavedSuccessfully") + " Ref: " + refNo
                );
            });
    }

    save(carpaymentForm?: NgForm) {


        this.carpayment.tenantId = abp.session.tenantId;
        this.carpayment.payeeName = this.payee;
        this.carpayment.debitGL = this.debitGL;
        this.carpayment.amountNowPaid = this.samount;
        this.carpayment.grossAmt = this.amtretired;
        this.carpayment.creditGL =this.defchartOfAcct[0].accountCode;

        //this.carpayment.creditGL = this.CashAndBankGL;
        this.carpayment.pDate = DateTime.fromJSDate(this.startdate);
        this.carpayment.pRefNo = this.refNo;
        //this.carpayment.pModeId = 1;


        if(this.carpayment.pModeId == null){
            this.carpayment.pModeId=1;
          }


        this.carpayment.currency = "NGN";

        var self = this;

        this.message.confirm(
            this.l("Do you want to proceed?"),
            this.l("Send for Approval"),
            (isConfirmed) => {
                if (isConfirmed) {
                    console.log(this.carpayment.postingDetails);
                    this.primengTableHelper.isLoading = true;
                    self._opex
                        .createCashRetirementPaymentMaster(this.carpayment)
                        .pipe(
                            finalize(() => {
                                this.primengTableHelper.isLoading = false;

                            })
                        )
                        .subscribe(
                            (r) => {
                            self.selectedItem = [];
                            self.getcarpaymentGridView(self.payee, self.refNo);
                            self.ischecked = false;
                            self.taxvalue = 0;
                            self.whtvalue = 0;
                            self.subtotal = 0;
                            self.mainAmount = 0;
                            this.amtadvanced = 0;
                            this.amtretired = 0;
                            this.samount = 0;
                            this.camount = 0;
                            this.refNo = "";
                            this.carpayment.remark = "";
                            this.carpayment.ledgerRemark = "";
                            this.BenRemark = "";
                            self.checkval = false;
                            self.carpayment = new OpexPaymentMasterDto();
                            self.getCaRPaymentTransactionUser();
                            carpaymentForm.reset();
                            this.message.success(
                                this.l("SavedSuccessfully") +
                                    " Ref: " +
                                    r +
                                    " and" +
                                    " sent For Approval"
                            );
                            this.close();
                            this.modalSaveR.emit(r);

                            this.ngOnInit();
                        }, (e) => {


                            this.close();
                            this.modalSaveR.emit();

                            this.ngOnInit();
                        }
                        
                        );
                }
            }
        );
    }

    getAdvancePostingDetails(amt: number) {
        this.postItems = [];
        this.carpayment.postingDetails = null;
        this.iPost = new PostItem();
        var requisitionNarration = "";
        if(this.AdvanceNarration == ''){
            this.AdvanceNarration =  this.refNo + ' - ' + this.carpayment.ledgerRemark;
        }


        this.records.forEach((u) => {

      this._opexm.getsplitcostList(u.id).toPromise().then( itemList => {


            itemList.forEach((y) => {
              var iPostg = new PostItem();
              iPostg.accountCode = u.transactionTypeGL;

              iPostg.beneficiaryCode = "";
              iPostg.creditAmount = 0;
              iPostg.debitAmount = y.amount * this.currencyRate;
              iPostg.narration = this.refNo + ' - ' + this.carpayment.ledgerRemark;
              requisitionNarration = this.carpayment.ledgerRemark;
              iPostg.accountName = u.transactionType.replace(u.transactionTypeGL,'').replace('-','');
            iPostg.referenceNumber = this.AdvancetransactionRef;
              iPostg.reportCode = y.department;
              iPostg.reportCodeDescription = y.departmentName;
              this.postItems.push(iPostg);
              requisitionNarration = u.narration;


          });

          });

        });


        let pIt = new PostDto();

        if (this.isCardTransaction) {

            this.iPost = new PostItem();
            this.iPost.accountCode = this.CashAdvanceGL;
            this.iPost.beneficiaryCode = "";
            this.iPost.creditAmount = this.amtretired * this.currencyRate;
            this.iPost.debitAmount = 0;
            this.iPost.accountName = "Card Account ";
            this.iPost.narration = this.refNo + ' - ' + this.carpayment.ledgerRemark;
            this.iPost.reportCode = this.misCode;
            this.iPost.reportCodeDescription = this.misCodeDescription;
            this.transactionRef = this.refNo;
            this.postItems.push(this.iPost);

        } else {
            this.iPost = new PostItem();
            this.iPost.accountCode = this.CashAdvanceGL;
            this.iPost.referenceNumber = this.AdvancetransactionRef;
            this.iPost.creditAmount = this.amtadvanced * this.currencyRate;
            this.iPost.debitAmount = 0;
            this.iPost.narration =  this.refNo + ' - ' + this.carpayment.ledgerRemark;

           
          // this.iPost.accountName =  this.cashAdvanceList.filter(x =>x.accountCode == this.CashAdvanceGL)[0].accountName;
            this.iPost.reportCode = this.misCode;
            this.iPost.reportCodeDescription = this.misCodeDescription;
            this.postItems.push(this.iPost);

            if (this.amtadvanced > this.amtretired) {
                this.iPost = new PostItem();
                this.iPost.accountCode = this.CashAndBankGL;
                this.iPost.accountName = this.defchartOfAcct.filter(i => i.accountCode == this.CashAndBankGL)[0].accountName;
                this.iPost.beneficiaryCode = "";
                this.iPost.creditAmount = 0;
                this.iPost.debitAmount =
                    (this.amtadvanced - this.amtretired) * this.currencyRate;
                    this.iPost.referenceNumber = this.AdvancetransactionRef;
              this.iPost.narration =  this.refNo + ' - ' + this.carpayment.ledgerRemark;
              this.iPost.reportCode = this.misCode;
              this.iPost.reportCodeDescription = this.misCodeDescription;
                this.postItems.push(this.iPost);
            }
            if (this.amtadvanced < this.amtretired) {
                this.iPost = new PostItem();
                this.iPost.accountCode = this.CashAndBankGL;
                this.iPost.accountName = this.defchartOfAcct.filter(i => i.accountCode == this.CashAndBankGL)[0].accountName;
                this.iPost.beneficiaryCode = "";
                this.iPost.creditAmount =
                    (this.amtretired - this.amtadvanced) * this.currencyRate;
                this.iPost.debitAmount = 0;
                this.iPost.narration = this.refNo + ' - ' + this.carpayment.ledgerRemark;
                this.iPost.referenceNumber = this.AdvancetransactionRef;
                this.iPost.reportCode = this.misCode;
                this.iPost.reportCodeDescription = this.misCodeDescription;
                this.postItems.push(this.iPost);
            }
        }
        pIt.transactionStatusId = 1;
        pIt.transactionType =22;
        if ( this.samount>0 && this.carpayment.pModeId ==1 && !this.isCardTransaction ) {

            pIt.transactionType =57;
        }

        pIt.currencyId = this.cId;
        pIt.valueDate = DateTime.fromJSDate(this.startdate); 
        pIt.tenantId = this.appSession.tenantId;
        pIt.postItem = this.postItems;
        pIt.ref = "";
        //this.carpayment.postingDetails = null;
        this.carpayment.postingDetails = pIt;


    }

    preview() {





  this.postdetails.showprepostDetails(this.carpayment.postingDetails, this.transactionRef);



    }

    add(id?: any) {
        this.caSplitCostViewModal.show(id);
    }

    getCurrencyId() {
        this._opexm.currencyId(this.carpayment.currency).subscribe((x) => {
            this.cId = x;
        });
    }

    deleterequest() {
        if (this.DeclineComment == null || this.DeclineComment == "") {
            return;
        } else {
            if (this.refNo == null || this.refNo == undefined) {
            } else {
                this.modalRef.hide();
                this.message.confirm(
                    this.l("Do you want to proceed?"),
                    this.l(
                        "Please, You have just clicked to terminate this transaction with Reference No:" +
                            " " +
                            this.refNo +
                            "\n" +
                            "Reason:" +
                            " " +
                            this.DeclineComment +
                            "."
                    ),
                    (isConfirmed) => {
                        if (isConfirmed) {
                            this._opex
                                .declineRetireFinance(
                                    this.refNo,
                                    this.DeclineComment
                                )
                                .subscribe(() => {
                                    this.notify.success(
                                        this.l(
                                            "Transaction terminated successfully"
                                        )
                                    );
                                    this.close();
                                    this.DeclineComment = '';
                                    this.modalSaveR.emit();

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

    createquery() {
        this.opexquerymodal.show(this.refNo, this.OperationId, this.payee, this.OperationId);

    
    }

    openModal(template: TemplateRef<any>) {
        const config: ModalOptions = {
            class: "modal-dialog-centered",
        };
        this.modalRef = this.modalService.show(template, config);
    }
    checkCreditGLSelected(): void {
        this.getAdvancePostingDetails(0);
        this.saving = true;
        this._opexm.getAccountBalance(this.CashAndBankGL).pipe(
            finalize(() => {
              this.saving = false;
            })
          ).subscribe(x => {
            this.accountBalance = x;
          });
    }
    exchangeRateValue() {
        this.totalValue = this.currencyRate * this.amtretired;

       this.getAdvancePostingDetails(0);
    }

  show(payee: any, refNo: any, opid: any): void {
    this.OPID = opid;

    if (opid == 21) {
        this.getCRAccountDefault();
        this.OperationId = opid;


    }else{
this.getCardGLs();
    }

    this.carpayment.pModeId = 0;
    this.isPaymentModeNotRequired = false;
    this.carpayment.currency = "NGN";
    this.OperationId = opid;
    this.carpayment.operationId = this.OperationId;
    this.getcarpaymentGridView(payee,refNo);
    this.totalCountOfSupportingDocument();
this.checkCreditGLSelected();
    this.modal.show();
  }

  onShown(): void {

  }
  close(): void {
      this.modal.hide();
  }


}
