import { DatePipe } from "@angular/common";
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Injector,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentsComponent } from "@app/operation/documents/documents.component";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    AccrualRequisitionDetailsDto,
    CreateTaxTransactionDto,
    TaxationDto,
    AccrualServiceServiceProxy,
    CalculateSpiltCostBudgetDto,
    ChartofAccountServiceServiceProxy,
    CreatePaymentTransactionDto,
    CurrencyDto,
    GeneralOperationsServiceServiceProxy,
    MultipleBeneficiariesDto,
    OperatingExpenseServiceServiceProxy,
    OperationsDto,
    PayeeNameViewDto,
    PayeeTypeDto,
    PaymentTransactionDto,
    TransactionTypeDto,
    WorkflowMappingDto,
    WorkflowServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { DateTime } from "luxon";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
import { MultiplebeneficiarymodalComponent } from "../multiplebeneficiarymodal/multiplebeneficiarymodal.component";
import { OpexaccrualmodalComponent } from "../opexaccrualmodal/opexaccrualmodal.component";
import { OpexworkflowroutemodalComponent } from "../opexworkflowroutemodal/opexworkflowroutemodal.component";
import { SplitcostmodalComponent } from "../splitcostmodal/splitcostmodal.component";
import { TaxtransactionmodalComponent } from "../taxtransactionmodal/taxtransactionmodal.component";

@Component({
    selector: "opexPendingTaskTab",
    templateUrl: "./opexpendingtasktab.component.html",
    styleUrls: ["./opexpendingtasktab.component.css"],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class OpexpendingtasktabComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit, OnChanges {
    paytransForm: NgForm;
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();

    paytrans: CreatePaymentTransactionDto = new CreatePaymentTransactionDto();

    records: PaymentTransactionDto[] = [];
    operationList: OperationsDto[] = [];
    transactionTypeList: TransactionTypeDto[] = [];

    saving = false;
    startdate = new Date();
    hasDate = false;

    mindate = new Date(new Date().getFullYear(), 1, 31);
    maxdate = new Date();
    mindatePrepayment = new Date();
    maxdatePrepayment = new Date(new Date().getFullYear(), 11, 31);
    hideTax = true;
    payeetypelist: PayeeTypeDto[] = [];
    vid = 0;
    wid = 0;
    payeenamelist: PayeeNameViewDto[] = [];
    accrualdetailList: AccrualRequisitionDetailsDto[] = [];
    vatTransaction = new TaxationDto();
    isWHTonTotal = true;
    isWHTonPayee = true;
    WHTRate = 0;
    VATRate = 0;
    isTaxRequiredEdit = true;
    isVATonTotal = true;
    whtid = 0;
    currencyRate = 1;
    taxableamount = 0;
    taxableamountWHT = 0;
    hidetaxinput=false;
    @ViewChild("taxTransactionModal", { static: true })
    taxTransactionModal: TaxtransactionmodalComponent;

    @ViewChild("splitCostModal", { static: true })
    splitCostModal: SplitcostmodalComponent;

    @ViewChild("opexWorkflowRouteModal", { static: true })
    opexWorkflowRouteModal: OpexworkflowroutemodalComponent;
    @ViewChild("opexAccrualModal", { static: true })
    opexAccrualModal: OpexaccrualmodalComponent;
    @ViewChild("multipleBeneficiaryModal", { static: true })
    multipleBeneficiaryModal: MultiplebeneficiarymodalComponent;
    totalAmount: any = 0;

    @ViewChild("appdocuments", { static: true })
    appdocuments: DocumentsComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    taxtransprimengTableHelper = new PrimengTableHelper();
    isReady = false;

    splitcostprimengTableHelper = new PrimengTableHelper();

    saveButtonDisabled = false;
    initiateButtonDisable = true;
    levelfromWorkflowMapping: WorkflowMappingDto[] = [];
    selectedoperationId: any;
    currencyList: CurrencyDto[] = [];
    VATList: TaxationDto[] = [];
    selectedOption: number = 0;
    WHTList: TaxationDto[] = [];
    taxableAmount: number = 1;
    taxableAmountWHT: number = 1;
    payableAmount: number = 0;
    whtValue: number = 0;
    vatValue: number = 0;
    whtValue2: number = 0;
    vatValue2: number = 0;
    payableAmountConverted: number = 0;
    grossAmount: number = 0;
    taxable: any = "0.00";
    taxItems: CreateTaxTransactionDto[] = [];
    multiplebeneficiarylist: MultipleBeneficiariesDto[] = [];
    hideMultiBeneficiarmodal: boolean;

    calculatebugetforMIS = new CalculateSpiltCostBudgetDto();

    hidesla: boolean;
    disableinvoicefield: boolean;
    hideEditForm: boolean;
    disableAmountField: boolean;
    active = false;
    sampleDateRange: DateTime[] = [
        this._dateTimeService.getStartOfDay(),
        this._dateTimeService.getStartOfMonthPlusMonth(2),
    ];

    paymentId: any;
    paymentAmount: any;
    transactionTypeId: any;
    requestDate: DateTime;
    requestNumber: any;

    constructor(
        injector: Injector,
        private _getChartOfAcct: ChartofAccountServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _operationService: GeneralOperationsServiceServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _workflowService: WorkflowServiceServiceProxy,
        private _router: Router,
        private _accrualservice: AccrualServiceServiceProxy,
        private datePipe: DatePipe,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.maxdatePrepayment = new Date(
            this._dateTimeService.plusDays(new Date(), 365).toJSDate()
        );
        this.primengTableHelper.isLoading = true;
        this.getOperation();
        this.gettransactionType();
        this.getOpexTotalAmount();
        this.gettaxation();
        this.getCurrencyList();
        this.getPayeeTpe();
        this.refresh();
        this.paytrans.amount = 1;
        this.CalculateBudgetUsedforMIS();

        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {
                OPD: 7,
            },
            queryParamsHandling: "merge",
            // preserve the existing query params in the route
            // skipLocationChange: true
            // do not trigger navigation
        });

        this.primengTableHelper.isLoading = false;
    }

    ngOnChanges(): void {}

    ngAfterViewInit(): void {}

    gettaxation() {
        this._opex.getApprovedTaxationActive().subscribe((items) => {
            this.VATList = items.filter((x) => x.witholding == false).sort();
            this.WHTList = items.filter((x) => x.witholding == true).sort();
        });
    }

    effectAmount(event, id, tid) {
        let vat = 0;
        let wht = 0;
   
        var tItem = new CreateTaxTransactionDto();
        var tItemw = new CreateTaxTransactionDto();

        if (id === 2) {
            if (
                this.taxableAmountWHT == 1 ||
                this.paytrans.amount < this.taxableAmountWHT
            ) {
                this.taxableAmountWHT = this.paytrans.amount;
            }
            this.whtValue2 = (event / 100) * Number(this.taxableAmountWHT);
            tItem.coycode = id;
            tItem.amount = this.whtValue2;
            tItem.rate = event;
            tItem.taxId = this.whtid;
            tItem.taxableAmount = this.taxableAmountWHT;
            tItem.tenantId = 1;
            tItem.paymentId = this.paytrans.id;
            tItem.isPayeeBearer = this.isWHTonPayee;
            this.AddTaxItem(tItem);
            this.paytrans.whtAmount = this.whtValue2;
        }
        if (id === 3) {
            if (
                this.taxableAmount == 1 ||
                this.paytrans.amount < this.taxableAmount
            ) {
                this.taxableAmount = this.paytrans.amount;
            }

            this.vatValue2 = (this.VATRate / 100) * Number(this.taxableAmount);
            tItem.coycode = id;
            tItem.amount = this.vatValue2;
            tItem.rate = this.VATRate;
            tItem.taxId = this.vatTransaction.id;
            tItem.taxableAmount = this.taxableAmount;
            tItem.tenantId = 1;
            tItem.paymentId = this.paytrans.id;
            this.AddTaxItem(tItem);
            this.paytrans.taxAmount = this.vatValue2;
        }
        vat = this.vatValue2;
        wht = this.whtValue2;

        this.payableAmount = Number(this.paytrans.amount) + vat - wht;
        this.grossAmount = Number(this.paytrans.amount) + vat;

        this.payableAmountConverted = Number(
            this.grossAmount * this.currencyRate
        );
    }

    CostBearer() {
        this.effectAmount(this.WHTRate, 2, 0);

        if (this.isWHTonPayee) {
            this.payableAmount =
                Number(this.paytrans.amount) + this.vatValue2 - this.whtValue2;
            this.grossAmount = Number(this.paytrans.amount) + this.vatValue2;
        } else {
            this.payableAmount = Number(this.paytrans.amount) + this.vatValue2;
            this.grossAmount =
                Number(this.paytrans.amount) + this.vatValue2 + this.whtValue2;
        }
    }
    validateAmount(event, type) {
        if (type == 0) {
            this.validateAmount(event, 1);
            this.validateAmount(event, 2);
        }

        if (type == 1) {
            if (Number(event) > Number(this.paytrans.amount)) {
                this.taxableAmount = 0;
                this.message.warn(
                    "Taxable amount cannot be greater than specified amount!"
                );

                return;
            }

            this.taxableAmount = event;
            this.effectAmount(this.VATRate, 3, 0);
        }
        if (type == 2) {
            if (Number(event) > Number(this.paytrans.amount)) {
                this.taxableAmountWHT = 0;
                this.message.warn(
                    "Taxable amount cannot be greater than specified amount!"
                );

                return;
            }

            this.taxableAmountWHT = event;
            this.effectAmount(this.WHTRate, 2, 0);
        }
    }
 
    AddTaxItem(item: CreateTaxTransactionDto) {
        if (this.taxItems.length > 0) {
            let index = this.taxItems.findIndex(
                (x) => x.coycode == item.coycode
            );

            if (index !== -1) {
                this.taxItems.splice(index, 1);
            }
        }
        if (item.rate > 0) {
            this.taxItems.push(item);
            this.paytrans.taxTransaction = this.taxItems;
        }
    }

    refresh() {
        this.paytrans.payeeTypeId = 0;
        this.paytrans.transactionTypeId = 0;
        this.paytrans.amount = 1;
    }

    show(result: PaymentTransactionDto): void {
        this.wid = 0;
        this.vid = 0;
        this.taxableAmount = 0;
        this.active = true;
        this.edit(result);
        this.payableAmount = result.amount;
        this.grossAmount = result.amount;

        this._opex.getTaxTransaction(result.id).subscribe((u) => {
            u.forEach((x) => {
                this.taxableAmount = x.taxableAmount;
                this._opex.getTaxation(true).subscribe((v) => {
                    v.forEach((r) => {
                        if (r.id == x.taxId) {
                            this.whtValue = x.rate;
                            this.whtValue2 = x.amount;
                            this.isWHTonPayee = x.isPayeeBearer;
                            this.WHTRate = x.rate;
                            this.wid = x.taxId;
                            this.effectAmount(x.rate, 2, x.taxId);
                            this.CostBearer();
                        }
                    });
                });
                x;
                this._opex.getTaxation(false).subscribe((v) => {

                  
                    v.forEach((r) => {
                        if (r.id == x.taxId) {

                            this.vatValue = x.rate;
                            this.vatValue2 = x.amount;
                            this.vatTransaction = r;
                            this.VATRate = x.rate;
                            this.effectAmount(x.rate, 3, x.taxId);
                            this.vid = x.taxId;
                            this.CostBearer();
                        }
                    });
                });
            });
        });
        this.paymentId = result.id;
        this.paymentAmount = result.amount;
        this.transactionTypeId = result.transactionTypeId;
        this.requestDate = result.requestDate;
        this.requestNumber = result.requestNumber;

       

        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

    getCurrencyList() {
        this._operationService.getCurrencyList().subscribe((x) => {
            this.currencyList = x;
        });
    }

    CalculateBudgetUsedforMIS() {
        this._opex.checkLoginUserMISBudget().subscribe((result) => {
            this.calculatebugetforMIS = result;
        });
    }

    showDocument() {
        this.appdocuments.ShowAttachmentByRef(this.paytrans.requestNumber, 7);
    }

    getOperation() {
        this._operationService.getListOperation().subscribe((items) => {
            this.operationList = items;
        });
    }

    getPayeeTpe() {
        this._opex.getPayeeList().subscribe((result) => {
            this.payeetypelist = result;
        });
    }

    getNamee(id: number) {
        this.paytrans.payeeName = "";
        this._opex.fetchPayeeName(id).subscribe((result) => {
            this.payeenamelist = result;
        });

        if (id === 1) {
            this.disableinvoicefield = true;
            this.paytrans.invoiceNumber = "NA";
             this.hidetaxinput= false;
            this.isTaxRequiredEdit = true;
            this.isVATonTotal = true;
            this.isWHTonTotal=true;
            this.taxableAmount=this.paytrans.amount;
                this.taxableAmountWHT=this.paytrans.amount; 
        } else {
            this.disableinvoicefield = false;
            this.paytrans.invoiceNumber = null;
            if(id===3){
                this.hidetaxinput= true;
                this.isTaxRequiredEdit = false;
                this.isVATonTotal = false;
                this.isWHTonTotal=false;
                this.taxableAmount=1;
                this.taxableAmountWHT=1;
            }else{
                this.hidetaxinput= false;
                this.isTaxRequiredEdit = true;
                this.isVATonTotal = true;
                this.isWHTonTotal=true;
                this.taxableAmount=this.paytrans.amount;
                this.taxableAmountWHT=this.paytrans.amount; 
            }
          
        }
    }

    getOpexTotalAmount() {
        this._opex.getOpexReqTotalAmount().subscribe((result) => {
            this.totalAmount = result;
        });
    }

    gettransactionType() {
        this._opex.getTransactionType().subscribe((items) => {
            this.transactionTypeList = items;
        });

        if (this.transactionTypeList != null) {
            this.saveButtonDisabled = true;
        }
    }

    save(paytransForm: NgForm) {
        this.paytrans.tenantId = abp.session.tenantId;

        if (this.whtValue2 == 0) {
            this.paytrans.whtAmount = 0;
        }
        if (this.vatValue2 == 0) {
            this.paytrans.taxAmount = 0;
        }

        this.paytrans.prepaymentStartDate = this.sampleDateRange[0];
        this.paytrans.prepaymentEndDate = this.sampleDateRange[1];
        this.message.confirm(
            "You want to edit request",
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.showMainSpinner();
                    this.primengTableHelper.isLoading = true;
                    this.saving = true;

                    this._opex
                        .editPendingOpex(this.paytrans)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                            })
                        )
                        .subscribe(() => {
                            this.message.info(
                                this.l("Request Successfully  Updated")
                            );
                            this.paytrans = new CreatePaymentTransactionDto();

                            this.close();
                            this.modalSave.emit(null);
                            //this. getOpexTotalAmount();
                            this.CalculateBudgetUsedforMIS();
                            this.saving = false;
                        });
                    this.hideMainSpinner();
                    this.primengTableHelper.isLoading = false;
                    paytransForm.resetForm();
                    this.refresh();
                }
            }
        );

        this.primengTableHelper.isLoading = false;
    }

    //To Disable save button if payeetypeid and payeename are different vendors
    checkifvaluematched(
        payeeTypeId: number,
        payeeName: string,
        transactionTypeId: number
    ) {
        this._opex
            .checkSameTransType(payeeTypeId, payeeName, transactionTypeId)
            .subscribe((result) => {
                let resultvalue = result;

                if (resultvalue == true) {
                    this.saveButtonDisabled = false;

                    return this.saveButtonDisabled;
                }
                if (resultvalue == false) {
                    this._opex.isrecordexistforuser().subscribe((result) => {
                        let vvv = result;

                        if (vvv == false) {
                            this.saveButtonDisabled = false;
                        } else {
                            this.saveButtonDisabled = true;
                        }
                    });
                }
            });
    }

    add(id?: any, amount?: any) {
        this.taxTransactionModal.show(this.paytrans.id, this.paytrans.amount);
    }

    resetAmount(id) {
        if (id == 1) {
            this.taxableAmount = this.paytrans.amount;
        }
        if (id == 2) {
            this.taxableAmountWHT = this.paytrans.amount;
        }
    }

    addsplitcost() {
        //let id = 0;

        this.splitCostModal.show(
            this.paytrans.id,
            this.grossAmount,
            this.paytrans.transactionTypeId,
            this.paytrans.requestDate
        );
    }

    addaccrual(
        id?: any,
        transactiontype?: string,
        amount?: any,
        requestNumber?: string
    ) {
        this.opexAccrualModal.show(id, transactiontype, amount, requestNumber);

        this._accrualservice
            .getUtilizedAccrualByRef(transactiontype)
            .subscribe((result) => {
                this.accrualdetailList = result;
                console.log(result);
            });
    }

    addmultibeneficiary(id?: any, amount?: any) {
        this.multipleBeneficiaryModal.show(
            this.paytrans.id,
            this.paytrans.amount
        );
    }

    addworkflowroute() {
        this.opexWorkflowRouteModal.show();
    }

    getTaxIds(id) {
        this.whtid = 0;
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
                                    this.whtid = d.id;
                                    this.taxableamountWHT = y.taxableAmount;
                                    this.isWHTonPayee = y.isPayeeBearer;
                                } else {
                                    this.taxableamount = y.taxableAmount;
                                }
                            }
                        });
                    });
                });
            }
        });
    }

    edit(f: PaymentTransactionDto): void {
        // this.disableAmountField=true;
        this.getTaxIds(f.id);
  
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
        this.paytrans.transactionTypeNarration = f.transactionTypeNarration;
        this.paytrans.whtAmount = f.whtAmount;
        this.paytrans.amount = f.amount;
        this.paytrans.invoiceNumber = f.invoiceNumber;
        this.paytrans.currency = f.currency;
        this.paytrans.invoiceDate = f.invoiceDate;
        this.startdate = f.invoiceDate.toJSDate();

        this.paytrans.applyPrepayments = f.applyPrepayments;
        if (this.paytrans.applyPrepayments == true) {
            this.hidesla = !this.hidesla;

            this.paytrans.prepaymentStartDate = f.prepaymentStartDate;
            this.paytrans.prepaymentEndDate = f.prepaymentEndDate;
            this.sampleDateRange = [f.prepaymentStartDate, f.prepaymentEndDate];
        } else {
            this.hidesla = false;
            this.sampleDateRange = [
                this._dateTimeService.getStartOfDay(),
                this._dateTimeService.getStartOfMonthPlusMonth(2),
            ];
        }

        if (f.taxAmount > 0 || f.whtAmount > 0) {
            this.hideTax = true;
        }

        //this.saveButtonDisabled =!this.saveButtonDisabled;

        this.getNamee(f.payeeTypeId);
        this.paytrans.payeeName = f.payeeName;
    }

    handleChangeTax() {
        this.vatValue = 0;
        this.vatValue2 = 0;
        this.VATRate = 0;
        this.isVATonTotal = true;

        if (this.isTaxRequiredEdit) {
            this.VATRate = this.vatTransaction.rate;
        }
        this.validateAmount(this.taxableAmount, 0);
      
    }

    handleChange1(e) {
        if (e.checked == true) {
            this.hidesla = !this.hidesla;
            this.paytrans.applyPrepayments == e.checked;
        } else {
            this.paytrans.applyPrepayments == e.checked;
            this.hidesla = false;
        }
    }
    getWHTValue(id) {
        this.WHTRate = 0;

        if (id > 0) {
            this.WHTRate = this.WHTList.filter((x) => x.id == id)[0].rate;
        }
        this.effectAmount(this.WHTRate, 2, 0);
    }
}
