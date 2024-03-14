import { debugOutputAstAsTypeScript } from "@angular/compiler";
import {
    AfterViewInit,
    Component,
    Injector,
    OnInit,
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
} from "@shared/service-proxies/service-proxies";
//import { ChartOfAccountDto,DefaultAccountDetailsDto, ChartofAccountServiceServiceProxy,  CurrencyDto, GeneralOperationsServiceServiceProxy,CashRetirementServiceServiceProxy, OpexPaymentDetailDto, OpexPaymentGridViewDto, OpexPaymentMasterDto, PaymentModeDto, PaymentTransactionDto, PostDto, PostItem, TransactionTypeDto, DefaultAccountDetailsServiceServiceProxy, OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from "moment";
import { Listbox, SelectItem, Table } from "primeng";
import { finalize } from "rxjs/operators";
//import {CashRetirementworkflowtrailmodalComponent } from './cashretirementworkflowtrailmodal/cashretirementworkflowtrailmodal.component';

//import { FileuploadComponent } from '@app/admin/fileupload/fileupload.component';
import { CASplitcostviewmodalComponent } from "./casplitcostviewmodal/casplitcostviewmodal.component";
import { DateTime } from "luxon";
import { DocumentsComponent } from "@app/operation/documents/documents.component";
import * as _ from "lodash";
import { OpexquerymodalComponent } from "@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Console, timeStamp } from "console";
import { ViewBeneficiaryTransactionAccountsComponent } from "@app/operation/view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component";
import { FileuploadComponent } from "@app/operation/FileDocuments/fileupload/fileupload.component";

@Component({
    selector: "app-cashretirementpaymentdetails",
    templateUrl: "./cashretirementpaymentdetails.component.html",
    styleUrls: ["./cashretirementpaymentdetails.component.css"],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CashRetirementpaymentdetailsComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit {
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
    // carpayment:  CreatecarpaymentDetailsDto = new CreatecarpaymentDetailsDto();
    @ViewChild("opexquerymodal", { static: true })
    opexquerymodal: OpexquerymodalComponent;
    @ViewChild("viewbeneficiary", { static: true })
    viewbeneficiary: ViewBeneficiaryTransactionAccountsComponent;
    CASH_RETIREMENT_PAYMENT_OPERATION_ID = 22;
    // operationList: OperationsDto[] = [];
    // cashAdvanceList: DefaultAccountDetailsDto[] = [];
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

    selectedGroup: any;
    //groups: any [] = [];
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
    //carpayment: CreatecarpaymentDetailsDto = new CreatecarpaymentDetailsDto();
    //@ViewChild('cashretirementWorkflowTrailModal', { static: true }) cashretirementWorkflowTrailModal: CashRetirementworkflowtrailmodalComponent;
    // @ViewChild('carpaymentTaxModal', { static: true }) carpaymentTaxModal: carpaymenttaxmodalComponent;
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

    constructor(
        injector: Injector,
        private _getChartOfAcct: ChartofAccountServiceServiceProxy,
        private _opex: CashRetirementServiceServiceProxy,
        private _operationService: GeneralOperationsServiceServiceProxy,
        private _getCAcctDefault: DefaultAccountDetailsServiceServiceProxy,
        private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy,
        private _opexm: OperatingExpenseServiceServiceProxy,
        private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
        private modalService: BsModalService
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
    showDocument(id: any, OPID: number) {
        //this.appfileupload.ShowAttachmentByRef(id, OPID);
        this.appdocuments.ShowAttachmentByRef(id, OPID);
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

    getcarpaymentGridView(payeeName?: string, refNo?: string) {
        if (this.refNo === refNo) return;

        this.primengTableHelper.isLoading = true;
        this.payee = payeeName;
        this.refNo = refNo;

        this.getAdvamount(refNo, () =>
            this.getRetamount(refNo, () =>
                this.getReqNarration(refNo, () => {
                    this._opex
                        .cashRetirementPaymentGrid(payeeName, refNo)
                        .subscribe((result) => {
                            this.records = result;

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
                                if (this.amtadvanced > this.amtretired) {
                                    this.camount =
                                        this.amtadvanced - this.amtretired;
                                    this.samount = 0;
                                } else {
                                    this.samount =
                                        this.amtretired - this.amtadvanced;
                                    this.camount = 0;
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
                            this.CashAndBankGL = "";

                            this._opex.getAdvancePaymentRef(this.refNo).subscribe((x) => {
                            this.paymentRef =    x;
                          });
                           
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

        // let ccc : any;
        // let taxvalue: any;
        // let whtvalue: any;
        this.taxvalue = +tax * +(taxableAmount / 100);
        this.ccc = +this.amountpaying + +this.taxvalue;
        this.whtvalue = +wht * +(taxableAmount / 100);
        this.mainAmount = this.ccc - this.whtvalue;
        this.carpayment.amountNowPaid = this.mainAmount;

        // (payDetails.GrossAmt + payDetails.TaxAmount) - payDetails.WHTAmount;
    }

    checkAdvanceTransaction(amt: any) {
        if (
            this.carpayment.creditGL === "0" ||
            this.carpayment.creditGL === undefined
        ) {
            this.message.error(this.l("Please select credit or debit gl"));
            // $event.target.checked=false;
            return;
        }

        let amount = 0;
        this.caDetail = [];
        //this.carpayment.payDetails = [];
        this.carpayment.postingDetails = new PostDto();

        var ittem = this.records;
        ittem.forEach((xx) => {
            let i = new OpexPaymentMasterDto();
            //console.log(xx)
            amount = xx.amount;
            i.amountNowPaid = xx.amount;
            i.invoiceNumber = this.carpayment.invoiceNumber;
            i.pRefNo = xx.refNo;
            i.payeeName = xx.payeeName;
            this.subtotal = amount;

            this.carpayment.taxAmount = xx.tax;
            this.carpayment.whtAmount = xx.wht;
            this.carpayment.taxableAmount = xx.taxableAmount;
            this.amountpaying = amount;
            this.checkval = xx.checked;
            this.caDetail.push(i);
        });

        this.getAdvancePostingDetails(amount);
        this.carpayment.grossAmt = amount;
        this.calculatedAmountNowPaying(
            this.carpayment.taxableAmount,
            this.carpayment.taxAmount,
            this.carpayment.whtAmount
        );
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
        this.checkAdvanceTransaction(this.amtretired);

        this.carpayment.tenantId = abp.session.tenantId;
        this.carpayment.payeeName = this.payee;
        this.carpayment.debitGL = this.debitGL;
        this.carpayment.amountNowPaid = this.samount;
        this.carpayment.grossAmt = this.amtretired;
        this.carpayment.creditGL = this.CashAndBankGL;
        this.carpayment.pDate = DateTime.fromJSDate(this.startdate);
        this.carpayment.pRefNo = this.refNo;
        this.carpayment.pModeId = 1;
        this.carpayment.currency = "NGN";

        var self = this;
        console.log("The posting Details is :", self.carpayment.postingDetails);
        this.message.confirm(
            this.l("Do you want to proceed?"),
            this.l("Send for Approval"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    self._opex
                        .createCashRetirementPaymentMaster(self.carpayment)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                                
                            })
                        )
                        .subscribe((r) => {
                            console.log("The posting Details is :", self.carpayment.postingDetails);
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
                            this.ngOnInit();
                        });
                }
            }
        );
    }

    getAdvancePostingDetails(amt: number) {
        this.postItems = [];
        this.carpayment.postingDetails = null;
        this.iPost = new PostItem();
        var requisitionNarration = "";


        this.records.forEach((u) => {

      this._opexm.getsplitcostList(u.id).toPromise().then( itemList => {

            itemList.forEach((y) => {
              var iPostg = new PostItem();
              iPostg.accountCode = u.transactionTypeGL;
              iPostg.beneficiaryCode = "";
              iPostg.creditAmount = 0;
              iPostg.debitAmount = y.amount * this.currencyRate;
              iPostg.narration = u.narration;
              requisitionNarration = u.narration;
            //  iPostg.narration = this.carpayment.ledgerRemark;
              iPostg.reportCode = y.department;
              iPostg.reportCodeDescription = y.departmentName;
              this.postItems.push(iPostg);

              console.log("iPostg Debit Amount:",   iPostg.debitAmount)
              console.log("iPostg Credit Amount:",   iPostg.creditAmount)



          });

          });

        });






        let pIt = new PostDto();

        if (this.isCardTransaction) {
            console.log("card Debit Amount at the beginning",this.iPost.debitAmount);
            console.log("card Credit Amount at the beginning",this.iPost.creditAmount);
            this.iPost = new PostItem();
            this.iPost.accountCode = this.CashAdvanceGL;
            this.iPost.beneficiaryCode = "";
            this.iPost.creditAmount = this.amtretired * this.currencyRate;
            this.iPost.debitAmount = 0;
        
            this.iPost.narration = this.carpayment.ledgerRemark;
            this.iPost.reportCode = "";
            console.log("card Debit Amount at the End",this.iPost.debitAmount);
            console.log("card Credit Amount at the End",this.iPost.creditAmount);
            this.postItems.push(this.iPost);
            console.log(" The postItems for card",this.postItems);
        } else {
            this.iPost = new PostItem();
            this.iPost.accountCode = this.CashAdvanceGL;
            this.iPost.beneficiaryCode = this.AdvancetransactionRef;
            this.iPost.creditAmount = this.amtadvanced * this.currencyRate;
            this.iPost.debitAmount = 0;
            this.iPost.narration = this.AdvancetransactionRef + ' - ' + this.AdvanceNarration;
           // this.iPost.narration = this.carpayment.ledgerRemark;
           
            this.iPost.reportCode = this.misCode;
            this.iPost.reportCodeDescription = this.misCodeDescription;
            
            this.postItems.push(this.iPost);

            if (this.amtadvanced > this.amtretired) {
                this.iPost = new PostItem();
                this.iPost.accountCode = this.CashAndBankGL;
                this.iPost.beneficiaryCode = "";
                this.iPost.creditAmount = 0;
                this.iPost.debitAmount =
                    (this.amtadvanced - this.amtretired) * this.currencyRate;
              //  this.iPost.narration = this.carpayment.ledgerRemark;
              this.iPost.narration = requisitionNarration;
                this.iPost.reportCode = "";
                this.postItems.push(this.iPost);
            }
            if (this.amtadvanced < this.amtretired) {
                this.iPost = new PostItem();
                this.iPost.accountCode = this.CashAndBankGL;
                this.iPost.beneficiaryCode = "";
                this.iPost.creditAmount =
                    (this.amtretired - this.amtadvanced) * this.currencyRate;
                this.iPost.debitAmount = 0;
                this.iPost.narration = this.BenRemark;
               // this.iPost.narration = this.carpayment.ledgerRemark;
                this.iPost.reportCode = "";
                this.postItems.push(this.iPost);
            }
        }
        pIt.transactionStatusId = 1;
        pIt.transactionType = 22;
        pIt.currencyId = this.cId;
        pIt.valueDate = DateTime.fromJSDate(this.startdate); //this.carpayment.pDate;
        pIt.tenantId = this.appSession.tenantId;
        pIt.postItem = this.postItems;
        pIt.ref = "";
        this.carpayment.postingDetails = null;
        this.carpayment.postingDetails = pIt;
        console.log("carpayment.postingDetails",this.postItems);

    }

    preview() {





  this.postdetails.showprepostDetails(this.carpayment.postingDetails);



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
                                    setInterval(function () {
                                        location.reload();
                                    }, 3000);
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
        this.opexquerymodal.show(this.refNo, this.username, this.payee, 22);
    }

    openModal(template: TemplateRef<any>) {
        const config: ModalOptions = {
            class: "modal-dialog-centered",
        };
        this.modalRef = this.modalService.show(template, config);
    }
    checkCreditGLSelected(): void {
        this.getAdvancePostingDetails(0);
    }
    exchangeRateValue() {
        this.totalValue = this.currencyRate * this.amtretired;

       this.getAdvancePostingDetails(0);
    }
}
