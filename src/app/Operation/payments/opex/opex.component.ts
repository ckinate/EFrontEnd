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
import {
    BeneficiaryAccountWithAmount,
    TypeOfBeneficiary,
    BeneficiaryAccountProfilesServiceProxy,
    BeneficiaryAccountProfileDto,
    TypeOfPaymentStatus,
    FundingMasterDto,
    FundingDetailsDto,
    AccrualServiceServiceProxy,
    BeneficiarySplitCostDto,
} from "@shared/service-proxies/service-proxies";
import {
    ChartOfAccountDto,
    ChartofAccountServiceServiceProxy,
    CurrencyDto,
    GeneralOperationsServiceServiceProxy,
    OperatingExpenseServiceServiceProxy,
    OpexPaymentGridViewDto,
    OpexPaymentMasterDto,
    PaymentModeDto,
    PaymentTransactionDto,
    PostDto,
    PostItem,
    TransactionTypeDto,
    PrepaymentDetailDto,
    PrepaymentDto,
    PrepaymentServiceServiceProxy,
    TaxationDto,
    CostAmortizationDto,
    DefaultAccountDetailsServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { Listbox, SelectItem, Table } from "primeng";
import { finalize } from "rxjs/operators";

//import { FileuploadComponent } from '@app/admin/fileupload/fileupload.component';

import { DateTime } from "luxon";
import { DefaultThemeUiSettingsComponent } from "@app/admin/ui-customization/default-theme-ui-settings.component";
import { NgNotFoundTemplateDirective } from "@ng-select/ng-select/lib/ng-templates.directive";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { DocumentsComponent } from "@app/operation/documents/documents.component";

import * as _ from "lodash";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ViewBeneficiaryTransactionAccountsComponent } from "@app/operation/view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component";

import { Observable } from "rxjs";
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from "ngx-bootstrap/modal";
import { debug } from "console";
import { OpexworkflowtrailmodalComponent } from "@app/operation/opex/opexpaymentdetails/opexworkflowtrailmodal/opexworkflowtrailmodal.component";
import { OpexaccrualmodalComponent } from "@app/operation/opex/paymenttransaction/opexaccrualmodal/opexaccrualmodal.component";
import { OpexquerymodalComponent } from "@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component";
import { PrepaymentComponent } from "@app/operation/opex/opexpaymentdetails/prepayment/prepayment.component";
var tcredit;
var tdebit;

@Component({
  selector: 'appopexModal',
  templateUrl: './opex.component.html',
  styles: [
  ]
})
export class OpexComponent extends AppComponentBase implements OnInit {

  @ViewChild('opexModal' , {static: true}) modal: ModalDirective;
  @Output() modalSaveR: EventEmitter<any> = new EventEmitter<any>();
  paytransForm: NgForm;
  @ViewChild("dataTable", { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  prepaymentButtonDescription = "Save";
  isPrepaymentView = false;
  opexpayment: OpexPaymentMasterDto = new OpexPaymentMasterDto();
  @ViewChild("appdocuments", { static: true })
  appdocuments: DocumentsComponent;
  opexDetail: OpexPaymentMasterDto[] = [];
  // opexpayment:  CreateOpexPaymentDetailsDto = new CreateOpexPaymentDetailsDto();

  @ViewChild("viewAccrualDetailsModal", { static: true })
  viewAccrualDetailsModal: OpexworkflowtrailmodalComponent;
  @ViewChild("opexAccrualModal", { static: true })
  opexAccrualModal: OpexaccrualmodalComponent;
  @ViewChild("opexquerymodal", { static: true })
  opexquerymodal: OpexquerymodalComponent;
  // operationList: OperationsDto[] = [];
  transactionTypeList: TransactionTypeDto[] = [];
  paymentTransactionUsers: PaymentTransactionDto[] = [];
  paymentTransactionUsersFilterReserved: PaymentTransactionDto[] = [];
  paymentmode: PaymentModeDto[] = [];
  currency: CurrencyDto[] = [];
  records: OpexPaymentGridViewDto[] = [];
  saving = false;
  processing = false;
  startdate = new Date();
  hasDate = false;
  mindate: Date;
  BenRemark = "";
  cId: number;
  ExpenseId: string;
  selectedItem: OpexPaymentMasterDto[];
  isEntryPost = false;
  newSelectedItem: OpexPaymentMasterDto[];
  chartOfAcct: ChartOfAccountDto[] = [];
  chartOfAcctForCashandBank: ChartOfAccountDto[] = [];
  chartOfAcctForExpense: ChartOfAccountDto[] = [];
  filterText: any;
  selectedGroup: any;
  //groups: any [] = [];
  groupList: SelectItem[] = [];
  options = [];

  totalDebit = 0;
  totalCredit = 0;
  modalRef: BsModalRef;
  username: number = 6;
  @ViewChild("listBox") accessor: Listbox;
  @ViewChild("listBox", { read: NgModel }) model: NgModel;

  sampleDate: DateTime;
  sampleDateRange: DateTime[] = [
      this._dateTimeService.getStartOfDay(),
      this._dateTimeService.getStartOfMonthPlusMonth(2),
  ];

  mainAmount = 0;
  taxableamount: number;
  taxableamountWHT: number;
  isWHTonPayee = true;
  WHTonPayee = "";
  whtamount: number;
  taxamount: number;
  isReady = false;
  vatID = 0;
  whtID = 0;

  payee: any;
  refNo: any;
  ischecked = false;
  DeclineComment: string;
  //opexpayment: CreateOpexPaymentDetailsDto = new CreateOpexPaymentDetailsDto();
  @ViewChild("opexWorkflowTrailModal", { static: true })
  opexWorkflowTrailModal: OpexworkflowtrailmodalComponent;
  // @ViewChild("opexPaymentTaxModal", { static: true })
  // opexPaymentTaxModal: OpexpaymenttaxmodalComponent;
  @ViewChild("postdetails", { static: true })
  postdetails: PostingDetailsComponent;
  @ViewChild("prepaymentdetail", { static: true })
  prepaymentdetail: PrepaymentComponent;
  @ViewChild("viewbeneficiarytransactionaccounts", { static: true })
  viewbeneficiarytransactionaccounts: ViewBeneficiaryTransactionAccountsComponent;
  hidetaxform = false;
  hidetaxationform = false;
  editExchangeRate = false;

  postItems: PostItem[] = [];
  itemPost: PostDto = new PostDto();
  iPost: PostItem = new PostItem();
  prepayment: PrepaymentDto;
  anniversayDate: CostAmortizationDto = new CostAmortizationDto();
  transactionTypeNarration = "";
  OtherDebitGL = "0";
  OtherCreditGL = "0";
  subtotal = 0;
  discount = 0;
  taxAmount = 0;
  totalAmount = 0;
  amountpaying = 0;
  approvedAmount = 0;

  cashBankGL = "0";
  advancegl = "0";
  ccc: any;
  taxvalue = 0;
  whtvalue = 0;
  selectedIndex: number;
  pendDate: DateTime;
  pstartdate: DateTime;
  paymentDay: number;
  VATRate: number = 0;
  WHTRate: number = 0;
  isPrepayment: boolean = false;
  amortizationAmount: number = 0;
  PrepaymentGL: string;
  VATList: TaxationDto[] = [];
  WHTList: TaxationDto[] = [];
  RemarkNarration: string;
  LedgerremarkNarration: string;
  BeneficiaryNarration: string;

  debitAccountProfile: BeneficiaryAccountProfileDto;
  creditAccountProfile: BeneficiaryAccountProfileDto;
  creditAccountProfiles: BeneficiaryAccountWithAmount[] = [];

  creditGL: string;
  debitGL: string;

  Staff = 1;
  Vendor = 2;
  MultipleBeneficiary = 3;
  AmountPayable = 0;
  dCurrency = "";
  dRate = 1;
  OPEX_OPERATION_ID = 6;
  amortizationduration: number;

  comments: string;
  isDecline: boolean;
  showbutton1: boolean = true;
  showbutton2: boolean;
  beneficiaryList: BeneficiarySplitCostDto[] = [];
  disableEditTax: boolean = false;
  totalsum=0;
  amortizing = 0;
  constructor(
      injector: Injector,
      private _getChartOfAcct: ChartofAccountServiceServiceProxy,
      private _opex: OperatingExpenseServiceServiceProxy,
      private _operationService: GeneralOperationsServiceServiceProxy,
      private _prepaymentService: PrepaymentServiceServiceProxy,
      private _dt: DateTimeService,
      private _dateTimeService: DateTimeService,
      private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
      private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy,
      private _accrual: AccrualServiceServiceProxy,
      private modalService: BsModalService
  ) {
      super(injector);
  }

  ngOnInit(): void {
      this.processing = true;
      this.getPaymentTransactionUser();
      //this.gettransactionType();
      this.getCurrency();
      this.payeementMode();
      this.loadChartofAccount();
      this.getCashandBankFromDefaultAccount();
      this.getVATList();
      this.getWHTList();
      this._operationService.getDefaultCurrency().subscribe((s) => {
          this.dCurrency = s.currencyCode;
      });

      this._opex.getCostAmortizationForCompany().subscribe((x) => {
          this.anniversayDate = x;
      });

      this.getExpenseFromDefaultAccount();
      // thi
      //this.amortizationAmount = (this.amortizationAmount - this.totalsum );
      this.processing = false;
  }


  refresh() {}

  getVATList() {
      this.VATList = [];
      this._opex.getTaxation(false).subscribe((x) => {
          this.VATList = x;
      });
  }
  getWHTList() {
      this.VATList = [];
      this._opex.getTaxation(true).subscribe((x) => {
          this.WHTList = x;
      });
  }

  savePrePaymentView() {
      this.prepaymentdetail.show(this.prepayment.id, this.amortizationAmount);
  }



  checkIsprepayment() {
      //this.message.warn(this.l("Please, You already have Accrual Schedule running on this transaction, Applying Prepayment will termination the outstanding Accural Operation"));
      if (this.isPrepayment) {
          //alert('')
          this._opex.checkforPrepayment(this.refNo).subscribe((s) => {
              if (s === true) {
                  this.getAmortizationAmount();
              } else {
              }
          });
      }
  }

  getAmortizationAmount(){
      let i: number;
      this.totalsum = 0;
      this.amortizationAmount = 0;
      this._opex.getAllbyReference(this.refNo).subscribe((x) => {
          x.forEach(i => {
              this.totalsum += i.amountUtilizing;
          });
          this.amortizationAmount -= this.totalsum;
          this.amortizing = this.amortizationAmount;
      })
  }
  savePrePayment() {
      if (this.anniversayDate.minimumAmount > this.amortizationAmount) {
          this.message.error(
              this.l(
                  "Amortization Amount cannot be less than the minimum amount allowed"
              )
          );
      } else if (this.amortizationAmount == 0) {
          this.message.error(this.l("Amortization Amount cannot be Zero"));
      } else if ((this.amortizationAmount - this.totalsum) < this.amortizationAmount) {
          this.message.error(this.l("Amortization Amount" + " "+ (this.amortizationAmount) +" cannot be greater than Amortizing Amount" + " " + this.amortizing));
      }else if (this.PrepaymentGL == undefined) {
          this.message.error(this.l("Prepayment GL cannot be Empty"));
      } else {
          this.prepayment = new PrepaymentDto();
          this.prepayment.paymentDay = this.paymentDay;
          this.prepayment.prepaymentAccountCode = this.PrepaymentGL;
          this.prepayment.ref = this.refNo;
          this.prepayment.startDate = this.sampleDateRange[0];
          this.prepayment.endDate = this.sampleDateRange[1];
          this.prepayment.expenseAccountCode = this.opexpayment.transactiontypeGl;
          this.prepayment.amortizedAmount = this.amortizationAmount;
          this.prepayment.totalAmount = this.amortizationAmount;
          this._prepaymentService
              .createPrepaymentTransaction(this.prepayment)
              .subscribe((x) => {
                  this.notify.success(this.l("Saved successfully"));
                  this.prepayment.id = x;
              });
      }
  }

  ngAfterViewInit(): void {
      this.refresh();
  }

  showDocument(id: any) {
      this.appdocuments.ViewAttachmentByRef(this.refNo, 7);
  }

  isItemPrepayment() {
      this.isPrepayment = !this.isPrepayment;
  }

  ReloadpaymentGridView(events) {
      debugger;
      var event = events;
      let opSearch = this.paymentTransactionUsersFilterReserved;
      var iss = opSearch.filter(function (x) {
          return (
              x.amount.toString().includes(event.toLowerCase()) ||
              x.requestNumber.toLowerCase().includes(event.toLowerCase()) ||
              x.payeeId.toLowerCase().includes(event.toLowerCase())
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
  getPaymentTransactionUser() {
      this.primengTableHelper.isLoading = true;

      this.paymentTransactionUsers = [];
      this.paymentTransactionUsersFilterReserved = [];

      this._opex
          .getOpexPaymentUserList()
          .pipe(
              finalize(() => {
                  this.primengTableHelper.isLoading = false;
              })
          )
          .subscribe((items) => {
              this.paymentTransactionUsers = items;
              this.paymentTransactionUsersFilterReserved = items;
              //console.log(items);
          });
  }
  payeementMode() {
      this._opex.getPaymentModeList().subscribe((items) => {
          this.paymentmode = items;

          this.opexpayment.pModeId = 1;
      });
  }
  getCurrency() {
      this._operationService.getCurrencyList().subscribe((items) => {
          this.currency = items;
      });
  }

  getExpenseFromDefaultAccount() {
      this._getCAChartDefault
          .getDefaultAccountListByCode("005")
          .subscribe((items) => {
              this.chartOfAcctForExpense = items;
          });
  }
  loadChartofAccount() {
      this._getCAChartDefault
          .getDefaultAccountListByCode("015")
          .subscribe((items) => {
              this.chartOfAcct = items;
          });
  }

  getCashandBankFromDefaultAccount() {
      
      this._opex.getCashAndBankAccount().subscribe((items) => {
          this.chartOfAcctForCashandBank = items;
          this.opexpayment.creditGL = items[0].accountCode;
      });
  }

  getpaymentGridView(
      payeeName?: string,
      refNo?: string
      
  ) {
      this.opexpayment = new OpexPaymentMasterDto();
      this.opexpayment.pModeId = 1;
      this.processing = true;
      this.payee = payeeName;
      this.refNo = refNo;
      
      this.opexpayment.pRefNo = this.refNo;
      //this.ExpenseId = Id;
      // this.username = user;
      this.getReqoNarration(refNo);

      this._opex
          .opexPaymentGrid(payeeName, refNo)
          .pipe(
              finalize(() => {
                  this.processing = false;
              })
          )
          .subscribe((result) => {
              this.records = result;

              this.records.forEach((cc) => {
                  this.taxableamount = cc.taxableAmount;
                  this.taxAmount = cc.tax;
                  this.whtamount = cc.wht;
                  this.opexpayment.taxAmount = cc.tax;
                  this.opexpayment.whtAmount = cc.wht;
                  this.opexpayment.transCode = this.refNo;
                  this.opexpayment.transactiontypeGl = cc.transactionTypeGL;
                  this.opexpayment.currency = cc.currency;
                  this.opexpayment.taxableAmount = cc.taxableAmount;
                  this.mainAmount = cc.amount;
                  this.amountpaying = cc.amount;
                  this.subtotal = cc.amount;
                  this.ExpenseId = cc.id;

                  this.getCurrencyRate(this.dCurrency, cc.currency);
                  this.opexpayment.exchangeRate = this.dRate;
                  this.transactionTypeNarration = cc.transactionType;
                  this.isPrepayment = cc.applyPrepayment;
                  this.sampleDateRange[0] = cc.prepaymentStartDate;
                  this.sampleDateRange[1] = cc.prepaymentEndDate;

                  let mCount = 0;

                  if (
                      cc.prepaymentStartDate.year == cc.prepaymentEndDate.year
                  ) {
                      mCount =
                          cc.prepaymentEndDate.month -
                          cc.prepaymentStartDate.month;
                  } else {
                      mCount =
                          12 -
                          cc.prepaymentStartDate.month +
                          cc.prepaymentEndDate.month;
                  }

                  if (
                      this.anniversayDate.anniversaryDate >=
                      cc.prepaymentStartDate.day
                  ) {
                      mCount = mCount + 1;
                  }
                  this.taxvalue = 0;
                  this.whtvalue = 0;
                  this.amortizationduration = mCount;
                  this.AmountPayable = cc.amount;
                  this.approvedAmount = cc.amount;
                  this.isWHTonPayee = true;

                  this.getTaxIds(cc.id, true, cc.tax, cc.wht);

                  this.opexpayment.whtgl = cc.whtGL;
                  this.amortizationAmount = cc.amount;
                  this.opexpayment.creditGL = this.chartOfAcctForCashandBank[0].accountCode;
              });
          });

      this.opexpayment.ledgerRemark = this.LedgerremarkNarration;
      this.opexpayment.remark = this.RemarkNarration;
      this.BenRemark = this.BeneficiaryNarration;

      this.isPrepayment = false;
      this.pendDate = undefined;
      this.pstartdate = undefined;
      this.paymentDay = this.anniversayDate.anniversaryDate;
      this.amortizationAmount = 0;
      this.PrepaymentGL = undefined;
      this.isPrepaymentView = false;
      this._prepaymentService.getPrepaymentByRef(refNo).subscribe((x) => {
          this.prepayment = x;
          if (x.paymentDay > 0) {
              this.isPrepayment = true;
              //this.isPrepaymentView = true;
              this.pendDate = DateTime.local(
                  x.endDate.year,
                  x.endDate.month,
                  x.endDate.day
              );
              this.pstartdate = DateTime.local(
                  x.startDate.year,
                  x.startDate.month,
                  x.startDate.day
              );
              this.paymentDay = x.paymentDay;
             this.getAmortizationAmount();
              //this.amortizationAmount = x.totalAmount - this.getAmortizationAmount();
              this.PrepaymentGL = x.prepaymentAccountCode;
              this.opexpayment.transactiontypeGl = x.expenseAccountCode;
          }
      });

      this.disableEditTax = true;
      if (
          this.refNo === null ||
          this.refNo === undefined ||
          this.refNo == ""
      ) {
      } else {
          this._opex.getSplitCostListByRef(this.refNo, 0).subscribe((x) => {
              this.beneficiaryList = x;
              if (x.length == 1) {
                  this.disableEditTax = false;
              }
          });
      }

      this.hideMainSpinner();
  }

  getReqoNarration(ref: string) {
      this._opex.getoNarration(ref).subscribe((result) => {
          this.RemarkNarration = result;

          this.LedgerremarkNarration = result;
          this.BeneficiaryNarration = result;
      });
  }

  calculateTax(id: any, amount: any) {
      this._opex.calculateTax(id, amount).subscribe((result) => {
          this.mainAmount = result;
          this.opexpayment.amountNowPaid = this.mainAmount;
      });
  }

  selectAll(records, e) {
      this.selectedItem = [];
      this.ischecked = e;
      records.forEach((v) => {
          if (this.ischecked) {
              let opexitem = new OpexPaymentMasterDto();

              opexitem.id = this.opexpayment.id;
              opexitem.pMadeBy = v.madeBy;
              opexitem.amountNowPaid = this.opexpayment.amountNowPaid;
              opexitem.grossAmt = v.amount;
              opexitem.pRefNo = v.refNo;
              opexitem.transactiontypeGl = this.opexpayment.transactiontypeGl;
              opexitem.currency = this.opexpayment.currency;
              opexitem.pModeId = this.opexpayment.pModeId;
              opexitem.pDate = DateTime.fromJSDate(this.startdate); //this.opexpayment.pDate;
              opexitem.taxableAmount = v.taxableAmount;
              opexitem.whtgl = this.opexpayment.whtgl;
              opexitem.taxAmount = v.tax;
              opexitem.whtAmount = v.wht;
              opexitem.payeeName = v.payeeName;
              opexitem.invoiceNumber = v.invoiceNumber;

              this.selectedItem.push(opexitem); //you push it here right...
          } else {
              this.selectedItem = this.selectedItem.filter((m) => m != v.id);
          }
      });

      this.newSelectedItem = this.selectedItem; //assign as newSelectedItem.
  }

  makepayment() {
      this.processing = true;
      let ar = [];

      this.selectedItem.forEach((mm) => {
          let o = {
              id: mm.id,
              pMadeBy: mm.pMadeBy,
              amountNowPaid: this.opexpayment.amountNowPaid,
              grossAmt: mm.grossAmt,
              pRefNo: mm.pRefNo,
              transactiontypeGl: this.opexpayment.transactiontypeGl,
              //'currencyCodeId': this.opexpayment.currencyCodeId,
              currency: this.opexpayment.currency,
              pModeId: this.opexpayment.pModeId,
              pDate: DateTime.fromJSDate(this.startdate), //this.opexpayment.pDate,
              taxableAmount: mm.taxableAmount,
              whtgl: mm.whtgl,
              taxAmount: mm.taxAmount,
              whtAmount: mm.whtAmount,
              payeeName: mm.payeeName,
              invoiceNumber: mm.invoiceNumber,
              creditGL: this.opexpayment.creditGL,
          };
          ar.push(o);
      }); //end of forEAch...

      this.newSelectedItem = ar; //assign as newSelectedItem.

      this.save();

      this.processing = false;
  } //end of approveWorkFlow...



  async getBeneficiaryType(payeeTypeId: number): Promise<TypeOfBeneficiary> {
      const Staff = 1;
      const Vendor = 2;
      const MultipleBeneficiary = 3;
      const UnregisteredVendor = 4;

      if (Staff == payeeTypeId) return TypeOfBeneficiary.Staff;
      if (Vendor == payeeTypeId) return TypeOfBeneficiary.Vendor;

      if (MultipleBeneficiary == payeeTypeId) return TypeOfBeneficiary.Staff;
      return TypeOfBeneficiary.Staff;
  }

  save() {
      if (this.isPrepayment) {
          this._opex.checkforPrepayment(this.refNo).subscribe((s) => {
              if (s == true) {
                  this.message.confirm(
                      this.l("Do you want to proceed?"),
                      this.l(
                          "Please, You already have Accrual Schedule running on this transaction! Applying Prepayment will terminate the outstanding Accrual Operation"
                      ),
                      (isConfirmed) => {
                          if (isConfirmed) {
                              this._opex
                                  .disableAccuralRequisition(this.refNo)
                                  .subscribe(() => {
                                      this.notify.success(
                                          this.l(
                                              "The outstanding Accrual operation has been terminated successfully"
                                          )
                                      );
                                  });
                              this.saveopexpayment();
                          } else {
                              this.isPrepayment = false;
                              return;
                          }
                      }
                  );
              } else {
                  this.saveopexpayment();
              }
          });
      } else {
          this.saveopexpayment();
      }
  }

  saveopexpayment() {
      this.getAdvancePostingDetails(0);
        this.message.confirm(
          this.l("Do you want to proceed"),
          this.l("AreYouSure"),
          async (isConfirmed) => {
              if (isConfirmed) {
                  this.processing = true;
                  this.saving = true;
                  this.opexpayment.tenantId = abp.session.tenantId;
                  this.opexpayment.payeeName = this.payee;
                  this.opexpayment.grossAmt = this.AmountPayable;
                  this.opexpayment.amountNowPaid = this.mainAmount;
                  this.opexpayment.ledgerRemark = this.LedgerremarkNarration;
                  this.opexpayment.remark = this.RemarkNarration;

                  this.opexpayment.pDate = DateTime.fromJSDate(
                      this.startdate
                  );

                  var self = this;


                  const r = await self._opex
                      .createOpexPaymentMaster(this.opexpayment)
                      .pipe(
                          finalize(() => {
                              self.saving = false;
                              self.processing = false;
                          })
                      )
                      .toPromise();

                  this.message.info(
                      "Payment request initiated successfully. Ref: " + r,
                      "Payment Initiation"
                  );

                 this.close();
                 this.modalSaveR.emit(r);
                  this.clearItems();
              }
          }
      );
     
  }
  clearItems() {
      var self = this;
      self.selectedItem = [];
      self.getPaymentTransactionUser();
      self.getpaymentGridView();
      self.opexpayment = new OpexPaymentMasterDto();

      self.ischecked = false;
      self.taxvalue = 0;
      self.whtvalue = 0;
      self.subtotal = 0;
      self.mainAmount = 0;
      self.isPrepayment = false;
      self.paymentDay = 0;
      self.pstartdate = new DateTime();
      self.pendDate = new DateTime();
      self.amortizationAmount = 0;
      self.PrepaymentGL = "";
      self.opexpayment.taxableAmount = 0;
      self.opexpayment.transactiontypeGl = null;
      self.opexpayment.whtgl = null;
      self.opexpayment.currency = null;
      //  this.opexpayment.pModeId = '';
      self.LedgerremarkNarration = null;
      self.BeneficiaryNarration = null;
      self.RemarkNarration = null;

      self.opexpayment.transactiontypeGl == null;
      this.amountpaying = 0;
      this.AmountPayable = 0;
      self.opexpayment.creditGL == null;
      self.opexpayment.taxAmount == null;
      self.opexpayment.whtAmount == null;
  }
  getAdvancePostingDetails(amt: number, view: boolean = false) {


      if (!this.isEntryPost)
      {
          this.isEntryPost = true;
      
      this.opexpayment.postingDetails =  new PostDto();
      //Check to ensure that approved amount is not greater than processing amount
      if (this.approvedAmount < this.AmountPayable) {
          this.message.error(
              "Processing amount (" +
                  this.approvedAmount +
                  ") cannot be greater than approved amount!",
              "Amount Validation"
          );
          return;
      }

      //Please include MIS
      let amtDiff = 0;
      let pIt = new PostDto();
      this.postItems = [];
      let DebitGl = "";
      let beneficiaryCode = "";
      let percentAmortized = 0;
      DebitGl = this.opexpayment.transactiontypeGl;
      this.opexpayment.debitGL = DebitGl;
      let DiffBetweenExpenseAndPrepaidAmount = 0;
      //Check if prepayment is involved
      if (this.isPrepayment) {
          debugger;
          amtDiff = this.amortizationAmount;
          DebitGl = this.prepayment.prepaymentAccountCode;
          percentAmortized =
              this.amortizationAmount / (this.amountpaying + this.taxvalue);
          DiffBetweenExpenseAndPrepaidAmount =
              this.AmountPayable - this.amortizationAmount;
          //this.iPost = new PostItem();
          this.iPost.accountCode = this.prepayment.prepaymentAccountCode;
          this.iPost.beneficiaryCode = this.opexpayment.payeeName;
          this.iPost.creditAmount = 0;
          this.iPost.debitAmount = this.amortizationAmount;
          this.iPost.narration = this.LedgerremarkNarration;
          this.iPost.reportCode = "";

          this.postItems.push(this.iPost);

        } else {
          amtDiff = this.taxvalue + this.subtotal;
      }
      var isAccrued = false;
      this._accrual
          .getAccrualUtilizationPostingDetails(this.refNo)
          .subscribe((x) => {
              if (x.length > 0) {
                  isAccrued = true;
                  x.forEach((i) => {
                      this.iPost = new PostItem();
                      this.iPost.accountCode = i.accountCode;
                      this.iPost.beneficiaryCode = beneficiaryCode;
                      this.iPost.creditAmount = i.credit;
                      this.iPost.debitAmount = i.debit;
                      this.iPost.narration = i.narration;
                      this.iPost.reportCode = i.miscode;
                      this.postItems.push(this.iPost);
                  });
              }

              if (!isAccrued) {
                  if (percentAmortized !== 1) {
                      this._opex
                      .getSplitCostListByRef(this.refNo,0)
                      .subscribe((x) => {

                      x.forEach((i) => {


                           this.iPost = new PostItem();
                               this.iPost.accountCode = this.opexpayment.transactiontypeGl;
                               this.iPost.beneficiaryCode = beneficiaryCode;
                               this.iPost.creditAmount = 0;
                           
                              if (this.isPrepayment) {
                                  this.iPost.debitAmount = Number(((i.percent / 100) *  DiffBetweenExpenseAndPrepaidAmount ).toFixed(2));
                              } else {
                                  this.iPost.debitAmount =
                                  Number(((i.percent / 100) *  this.AmountPayable).toFixed(2));
                              }

                               this.iPost.narration = this.LedgerremarkNarration;
                               this.iPost.reportCode = i.department;
                               if (DiffBetweenExpenseAndPrepaidAmount > 0 || !this.isPrepayment) {
                                  this.postItems.push(this.iPost);
                               }
                               
                           });
                           console.log(pIt);
                           this.onObserver(pIt, view);
                       });
                  } else {
                      this.onObserver(pIt, view);
                  }
              } else {
                  this.onObserver(pIt, view);
              }
          });

      }
  }
  onObserver(pIt: PostDto, view: boolean = false) {
      //Credit GL

      this.isEntryPost = false;
      this.iPost = new PostItem();
      this.iPost.accountCode = this.opexpayment.creditGL;
      this.iPost.beneficiaryCode = ""; // this.customerDetails.id.toString();
      this.iPost.creditAmount = this.amountpaying;
      this.iPost.debitAmount = 0;
      this.iPost.narration = this.LedgerremarkNarration;
      this.iPost.reportCode = "";
      this.postItems.push(this.iPost);

      //WHT GL

      if (this.whtvalue > 0) {
          this.iPost = new PostItem();
          this.iPost.accountCode = this.opexpayment.whtgl;
          this.iPost.beneficiaryCode = ""; // this.customerDetails.id.toString();
          this.iPost.creditAmount = this.whtvalue;
          this.iPost.debitAmount = 0;
          this.iPost.narration = this.LedgerremarkNarration;
          this.iPost.reportCode = "";
          this.postItems.push(this.iPost);
      }
      pIt.transactionStatusId = 1;
      pIt.transactionType = 6;
      pIt.currencyId = this.cId;
      pIt.valueDate = DateTime.fromJSDate(this.startdate); //this.opexpayment.pDate;
      pIt.tenantId = this.appSession.tenantId;
      pIt.postItem = this.postItems;
      pIt.ref = "";
      this.opexpayment.postingDetails = pIt;
      if (view) {
          this.postdetails.showprepostDetails(
              this.opexpayment.postingDetails
          );
      }
  }

  preview() {
      this.getAdvancePostingDetails(0, true);
  }

  add(refNo?: any) {
      //let id = 0;
      this.hidetaxform = !this.hidetaxform;
      this.hidetaxationform = !this.hidetaxationform;

      this.opexWorkflowTrailModal.show(this.refNo);
  }

 
  addaccrualmodal(refno: any) {
      this.viewAccrualDetailsModal.show(refno);
  }
  getCurrencydetails() {
      this.getCurrencyId();
      this.checkCurrency();
  }

  getCurrencyRate(defaultCurrency, xCurrency) {
      this._operationService.currencyExchangeRa(xCurrency).subscribe((x) => {
          this.dRate = x.exchangeRate;

          this.opexpayment.exchangeRate = this.dRate;

          this.calculatedAmountNowPaying(
              this.opexpayment.taxableAmount,
              this.opexpayment.taxAmount,
              this.opexpayment.whtAmount,
              this.opexpayment.exchangeRate
          );
      });
  }
  calculatedAmountNowPaying(
      taxableAmount?: number,
      tax?: number,
      wht?: number,
      exchangeRate?: number
  ) {
      this.taxAmount = tax;
      this.whtamount = wht;
      this.taxvalue = 0;
      this.whtvalue = 0;

      if (this.opexpayment.currency === "NGN") {
          this.taxvalue = tax * (this.taxableamount / 100);
          this.ccc = this.subtotal + this.taxvalue;
          this.whtvalue = wht * (this.taxableamountWHT / 100);
          this.mainAmount = this.ccc - this.whtvalue;
      } else {
          this.taxvalue =
              +tax *
              +(this.taxableamount / 100) *
              this.opexpayment.exchangeRate;
          this.ccc = +this.amountpaying + +this.taxvalue;
          this.whtvalue =
              +wht *
              +(this.taxableamountWHT / 100) *
              this.opexpayment.exchangeRate;
          this.mainAmount = this.ccc - this.whtvalue;
      }
      this.AmountPayable = this.subtotal + this.taxvalue;
      if (this.isWHTonPayee) {
          this.amountpaying = this.subtotal + this.taxvalue - this.whtvalue;
      } else {
          this.amountpaying = this.subtotal + this.taxvalue;
          this.AmountPayable += this.whtvalue;
      }
      this.opexpayment.amountNowPaid = this.mainAmount;
  }
  checkCurrency() {
      let curenId = this.opexpayment.currency;

      //  this.opexpayment.exchangeRate = this.dRate;
      if (curenId == this.dCurrency) {
          this.editExchangeRate = false;
      } else {
          this.editExchangeRate = true;
      }
      this.getCurrencyRate(this.dCurrency, this.opexpayment.currency);

      // }
  }
  getCurrencyId() {
      this._opex.currencyId(this.opexpayment.currency).subscribe((x) => {
          this.cId = x;
      });
  }

  addAccrual(
      id: any,
      transactiontype: string,
      amount: any,
      requestNumber: string
  ) {
      id = this.ExpenseId;
      this.opexAccrualModal.show(
          id,
          this.transactionTypeNarration,
          amount,
          requestNumber
      );
  }

  checkTax() {
      if (Number(this.opexpayment.taxableAmount) > Number(this.subtotal)) {
          this.opexpayment.taxableAmount = 0;
          this.message.warn(
              "Taxable amount cannot be greater than specified amount!"
          );

          return;
      }

      this.calculatedAmountNowPaying(
          this.opexpayment.taxableAmount,
          this.opexpayment.taxAmount,
          this.opexpayment.whtAmount,
          1
      );
  }
  getVAT() {
      if (this.vatID > 0) {
          this._opex.getTaxation(false).subscribe((x) => {
              this.opexpayment.taxAmount = x.find(
                  (vv) => vv.id == this.vatID
              ).rate;
              this.checkTax();
          });
      } else {
          this.opexpayment.taxAmount = 0;
          this.checkTax();
      }
  }
  getWHTGL() {
      console.log(this.whtID);

      this.opexpayment.whtgl = undefined;
      if (this.whtID > 0) {
          this._opex.getTaxation(true).subscribe((x) => {
              this.opexpayment.whtgl = x.find(
                  (c) => c.id == this.whtID
              ).chartOfAccountCode;
              this.opexpayment.whtAmount = x.find(
                  (vv) => vv.id == this.whtID
              ).rate;
              this.checkTax();
          });
      } else {
          this.opexpayment.whtAmount = 0;
          this.checkTax();
      }
  }

  getTaxIds(id, witholding, tax, wht) {
      this.vatID = 0;
      this.whtID = 0;
      this.taxableamount = 0;
      this.taxableamountWHT = 0;
      this._opex.getTaxTransaction(id).subscribe((x) => {
          if (x.length > 0) {
              x.forEach((y) => {
                  this._opex.getAllTaxation().subscribe((e) => {
                      let sa = e.find((t) => t.id == y.taxId);

                      e.forEach((d) => {
                          if (d.id == y.taxId) {
                              if (d.witholding) {
                                  this.whtID = d.id;
                                  this.taxableamountWHT = y.taxableAmount;
                                  this.isWHTonPayee = y.isPayeeBearer;
                                  if (!y.isPayeeBearer) {
                                      this.approvedAmount += y.amount;
                                  }
                              } else {
                                  this.vatID = d.id;
                                  this.taxableamount = y.taxableAmount;
                                  this.approvedAmount += y.amount;
                              }
                          }
                      });

                      this.calculatedAmountNowPaying(0, tax, wht, 1);
                  });

                  this.calculatedAmountNowPaying(0, tax, wht, 1);
              });
          }
      });
  }

  exchangeRateValue(exchangerate: any) {
      this.calculatedAmountNowPaying(
          this.opexpayment.taxableAmount,
          this.opexpayment.taxAmount,
          this.opexpayment.whtAmount,
          exchangerate
      );
  }

  viewBeneficiary() {
      if (this.refNo == null || this.refNo == undefined) {
      } else {
          this.viewbeneficiarytransactionaccounts.show(this.refNo, null);
      }
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
                              .declineOpexTransaction(
                                  this.refNo,
                                  this.payee,
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
      this.opexquerymodal.show(this.refNo, this.username, this.payee , 7);
  }
  openModal(template: TemplateRef<any>) {
      const config: ModalOptions = {
          class: "modal-dialog-centered",
      };
      this.modalRef = this.modalService.show(template, config);
  }

  oncontinue(): void {}

  show(refNo: any, payee: any): void {

this.opexpayment.pModeId = 1;
    this.getpaymentGridView(payee,refNo);
    
    this.modal.show();
  }

  onShown(): void {

  }
  close(): void {
      this.modal.hide();
  }
}
