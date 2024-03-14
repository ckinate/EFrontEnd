import {
    AfterViewInit,
    Component,
    Injector,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import {
    ChartofAccountServiceServiceProxy,
    CreatePaymentTransactionDto,
    GeneralOperationsServiceServiceProxy,
    OperatingExpenseServiceServiceProxy,
    OperationsDto,
    PayeeNameViewDto,
    PayeeTypeDto,
    PaymentTransactionDto,
    TransactionTypeDto,
    WorkflowMappingDto,
    WorkflowServiceServiceProxy,
    CurrencyDto,
    AccrualRequisitionDetailsDto,
    MultipleBeneficiariesDto,
    AccrualServiceServiceProxy,
    ApprovingAuthoritiesDto,
    CalculateSpiltCostBudgetDto,
    CashAdvanceServiceServiceProxy,
    MisDto,
    CreateTaxTransactionDto,
    TaxationDto,
    BeneficiaryAccountProfilesServiceProxy,
    BeneficiaryAccountProfile,
    BeneficiaryAccountProfileDto,
    VendorDto,
    UnitViewDto,
    WorkflowTopStatsOutput,
    TenantDashboardServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';

import { OpexworkflowroutemodalComponent } from './opexworkflowroutemodal/opexworkflowroutemodal.component';
import { SplitcostmodalComponent } from './splitcostmodal/splitcostmodal.component';
import { TaxtransactionmodalComponent } from './taxtransactionmodal/taxtransactionmodal.component';

import { OpexaccrualmodalComponent } from './opexaccrualmodal/opexaccrualmodal.component';
import { MultiplebeneficiarymodalComponent } from './multiplebeneficiarymodal/multiplebeneficiarymodal.component';

import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { OpexpendingtasktabComponent } from './opexpendingtasktab/opexpendingtasktab.component';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CreateVendorOpexModalComponent } from './opexunregisteredvendormodal/create-opex-unregistered-vendor-modal.compnent';
import { type } from 'os';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';


let that;


@Component({
    templateUrl: './paymenttransaction.component.html',
    styleUrls: ['./paymenttransaction.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class PaymenttransactionComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit {
    //@Output() modalxx: EventEmitter<any> = new EventEmitter<any>();
    paytransForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();

    paytrans: CreatePaymentTransactionDto = new CreatePaymentTransactionDto();

    records: PaymentTransactionDto[] = [];
    operationList: OperationsDto[] = [];
    transactionTypeList: TransactionTypeDto[] = [];
    submitted: boolean= false;
    saving = false;
    startdate = new Date();
    hasDate = false;
    mindate = new Date(new Date().getFullYear() - 1, 1, 31);
    hideTax = true;

    maxdate = new Date();
    mindatePrepayment = new Date();
    maxdatePrepayment = new Date(new Date().getFullYear(), 11, 31);
    vatratevalue = '';
    vatTransaction = new TaxationDto();
    isWHTonTotal = true;
    isWHTonPayee = true;
    WHTRate = 0;
    VATRate = 0;
    isTaxRequired = true;
    isVATonTotal = true;
    whtid = 0;

    hidetaxinput=false;

    payeetypelist: PayeeTypeDto[] = [];

    payeenamelist: PayeeNameViewDto[] = [];
    accrualdetailList: AccrualRequisitionDetailsDto[] = [];

    @ViewChild('taxTransactionModal', { static: true })
    taxTransactionModal: TaxtransactionmodalComponent;

    @ViewChild('splitCostModal', { static: true })
    splitCostModal: SplitcostmodalComponent;

    @ViewChild('opexWorkflowRouteModal', { static: true })
    opexWorkflowRouteModal: OpexworkflowroutemodalComponent;
    @ViewChild('opexAccrualModal', { static: true })
    opexAccrualModal: OpexaccrualmodalComponent;
    @ViewChild('multipleBeneficiaryModal', { static: true })
    multipleBeneficiaryModal: MultiplebeneficiarymodalComponent;
    @ViewChild('opexPendingTaskTab', { static: true })
    opexPendingTaskTab: OpexpendingtasktabComponent;

    @ViewChild('createVendorOpexModal', { static: true })
    createVendorOpexModal: CreateVendorOpexModalComponent;
    totalAmount: any = 0;
    VATList: TaxationDto[] = [];
    selectedOption = 0;
    WHTList: TaxationDto[] = [];
    taxableAmount = 1;
    taxableAmountWHT = 1;
    grossAmount = 0;
    invoiceAmount = 0;
    payableAmount = 0;
    whtValue = 0;
    vatValue = 0;
    whtValue2 = 0;
    vatValue2 = 0;
    taxable: any = '0.00';
    taxItems: CreateTaxTransactionDto[] = [];
    bankDetails = '';
    benBankDetailId = 0;
    benBankDetailList: BeneficiaryAccountProfileDto[] = [];
    benDisabled = true;
    Payeeid: number;
    payeenamedetails = new PayeeNameViewDto();
    unitDetail = new UnitViewDto();
    unitDetails: UnitViewDto[] = [];
    uploadStatus:boolean = false;
    // @ViewChild('appdocuments', { static: true })
    // appdocuments: DocumentsComponent;
    @ViewChild("fileUpload", { static: true }) fileUpload: FileuploadComponent;


    taxtransprimengTableHelper = new PrimengTableHelper();
    isReady = false;

    splitcostprimengTableHelper = new PrimengTableHelper();

    saveButtonDisabled = false;
    initiateButtonDisable = true;
    levelfromWorkflowMapping: WorkflowMappingDto[] = [];
    selectedoperationId: any;
    currencyList: CurrencyDto[] = [];
    multiplebeneficiarylist: MultipleBeneficiariesDto[] = [];
    hideMultiBeneficiarmodal: boolean;
    Approvingauthority: ApprovingAuthoritiesDto[] = [];
    calculatebugetforMIS = new CalculateSpiltCostBudgetDto();
    misDetails = new MisDto();

    calculatebuget = new CalculateSpiltCostBudgetDto();
    disableinvoicefield: boolean;

    isExist: boolean;
    isMisDefinedForUser: boolean;
    hideInitiationPage: boolean;

    loginUserMis: any;
    isPrepayment = false;
    attachId: string;
    hidesla: boolean;
    viewBankDetails = true;
    /*  sampleDateRange: DateTime[] = [
        this._dateTimeService.getStartOfDay(),
        this._dateTimeService.getStartOfMonthPlusMonth(2)
    ]; */
    sampleDateRange: DateTime[];
    RateDescription = 'Rate: ';
    currencyRate = 1;
    payableAmountConverted = 0;
    //maxdate = new Date();

    getListOfVendors: VendorDto[] = [];
    getListOfBeneficiaryDetails: BeneficiaryAccountProfileDto[] = [];
    // private datePipe: DatePipe){
    //   this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');

    workflowLoading = false;
   workflowData: WorkflowTopStatsOutput[] = [];
   pendingAmount = 0; pendingAmountCounter = 0;
   authorizedAmount = 0; authorizedAmountCounter = 0;
   declinedAmount = 0; declinedAmountCounter = 0;
   totalworkflowAmount = 0; totalCounter = 0;
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
        private _cashAdvance: CashAdvanceServiceServiceProxy,
        private _dateTimeService: DateTimeService,
        private _beneficiaryBankDetails: BeneficiaryAccountProfilesServiceProxy,
        private _tenantDashboardServiceProxy: TenantDashboardServiceProxy,
    ) {
        super(injector);
    }



    ngOnInit(): void {
        this.clearItems();
        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {
                OPD: 7,
            },
            queryParamsHandling: 'merge',
            // preserve the existing query params in the route
            // skipLocationChange: true
            // do not trigger navigation
        });

        this.paytrans.currency = 'NGN';
        this.primengTableHelper.isLoading = false;
        this.loadTopStatsData();
        that = this;
    }

    clearItems(): void {
        this.maxdatePrepayment = new Date(
            this._dateTimeService.plusDays(new Date(), 365).toJSDate()
        );

        this.primengTableHelper.isLoading = true;
        this.loadPendingTransaction();
        this.getOperation();
        this.gettransactionType();
        this.gettaxation();
        this.getLoginUserMis();
        this.getCurrencyList();
        this.getPayeeTpe();
        this.refresh();
        this.paytrans.amount = 0;
        this.CalculateBudgetUsedforMIS();
        this.checkLocalstorage();
        this.isWHTonTotal = true;
        this.isTaxRequired = true;
        this.isVATonTotal = true;
        this.isWHTonPayee = false;
        this.paytrans.applyPrepayments = false;
        this.paytrans.currency = 'NGN';


    }
    ngAfterViewInit(): void {}

    getLoginUserMis() {
        this._opex.getLoginUserMIS().subscribe((result) => {
            this.misDetails = result;
        });
    }
    evalute(event: any) {
        alert(this.startdate);
    }

    refresh() {
        this.paytrans.payeeTypeId = 0;
        this.paytrans.transactionTypeId = 0;
        this.paytrans.amount = 1;
        this.paytrans.currency = 'NGN';
        this.paytrans.applyPrepayments = false;
        // this.paytrans.payeeName= "Select Beneficiary";
    }

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

    getApprovingAuthoritiesList() {
        this._workflowService.approvingAuthorities(7).subscribe((x) => {
            this.Approvingauthority = x;
        });
    }

    // showDocument(id: any) {
    //     this.appdocuments.ShowAttachmentByRef(id, 7);
    // }

    fileDocument(id: any){
        this.fileUpload.ShowAttachment(id,7);
        this.uploadStatus = true;
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

    // getNamee(id: number) {
    //   this.viewBankDetails = false;
    //   this.benBankDetailId = 0;
    //     this.primengTableHelper.isLoading = true;
    //     this.paytrans.payeeName = "";
    //     this._opex.fetchPayeeName(id).subscribe((result) => {
    //         this.payeenamelist = result;
    //     });

    //     if (id === 1) {
    //         this.paytrans.invoiceNumber = "";
    //         this.benName();
    //     } else {
    //         this.paytrans.invoiceNumber = null;
    //         if (id ===3) {
    //           this.viewBankDetails = true;
    //         }
    //     }
    //     this.primengTableHelper.isLoading = false;
    // }

    getNamee(id: number) {

        this.saving = true;
        this.Payeeid = id;
        this.viewBankDetails = false;

        this.benBankDetailId = 0;
        this.primengTableHelper.isLoading = true;
        this.paytrans.payeeName = '';
        this._opex.fetchPayeeName(id).subscribe((result) => {
            this.payeenamelist = result;
        });






        if (id === 1) {
            this.paytrans.invoiceNumber = '';
            this.benName();
            this.hidetaxinput= false;
            this.isTaxRequired = false;
            this.isVATonTotal = true;
            this.isWHTonTotal=true;
            this.taxableAmount= this.paytrans.amount;
            this.taxableAmountWHT= this.paytrans.amount;
            this.handleChangeTax();
        } else {
            this.paytrans.invoiceNumber = null;
            if (id === 3) {

                this.viewBankDetails = true;
                this.hidetaxinput= true;
                this.isTaxRequired = false;
                this.isVATonTotal = false;
                this.isWHTonTotal=false;
                this.taxableAmount=1;
                this.taxableAmountWHT=1;
            }
            if (id === 4) {
                this.getAllVendorList();
                this.hidetaxinput= false;
                this.isTaxRequired = true;
                this.isVATonTotal = true;
                this.isWHTonTotal=true;
                this.taxableAmount=this.paytrans.amount;
                this.taxableAmountWHT=this.paytrans.amount;
            }
        }

        this.saving = false;
        this.primengTableHelper.isLoading = false;

    }

    getOpexTotalAmount() {
        this._opex.getOpexReqTotalAmount().subscribe((result) => {
            this.totalAmount = result;
        });
    }

    gettransactionType() {
        this._opex.getTransactionTypeActive().subscribe((items) => {
            this.transactionTypeList = items;
        });

        if (this.transactionTypeList != null) {
            this.saveButtonDisabled = true;
        }
    }

    save(paytransForm: NgForm) {
        this.submitted = true;
        if (this.paytrans == null || this.paytrans == undefined) {
            return;
          }
        this.saveexpenserequistion(paytransForm);
    }

    saveexpenserequistion(paytransForm) {
        this.paytrans.tenantId = abp.session.tenantId;
        this.paytrans.invoiceDate = DateTime.fromJSDate(this.startdate);
        this.paytrans.temporalPaymentId = this.attachId;
        this.paytrans.budgetTotalAmount = this.calculatebugetforMIS.budgetTotalAmount;
        this.paytrans.budgetUsedAmount = this.calculatebugetforMIS.budgetUsedAmount;
        this.paytrans.availableBudget = this.calculatebugetforMIS.availableBudgetAmount;

        this.paytrans.applyPrepayments = this.hidesla;
        if (this.hidesla) {
            this.paytrans.prepaymentStartDate = this.sampleDateRange[0];
            this.paytrans.prepaymentEndDate = this.sampleDateRange[1];
        }

        this.paytrans.beneficiaryBankDetailsID = this.benBankDetailId;

        this._opex
            .doesSimiliarRequestExist(this.paytrans)
            .subscribe((result) => {
                this.isExist = result;

                if (this.isExist === true) {
                    this.message.confirm(
                        ' Similiar request already exist, Do you want to proceed?',
                        this.l('AreYouSure'),
                        (isConfirmed) => {
                            if (isConfirmed) {
                                if (this.paytrans.id == null) {
                                    this.showMainSpinner();
                                    this.primengTableHelper.isLoading = true;
                                    this.saving = true;

                                    this._opex
                                        .initiateRequest(this.paytrans)
                                        .pipe(
                                            finalize(() => {
                                                this.saving = false;
                                            })
                                        )
                                        .subscribe((r) => {
                                            // this.notify.info(this.l('SavedSuccessfully'));
                                            console.log(r);
                                            if(r != null){
                                                this.message.info(
                                                    this.l(
                                                        'Saved successfully  with'
                                                    ) +
                                                        ' Ref: ' +
                                                        r
                                                );
                                            }

                                            this.paytrans = new CreatePaymentTransactionDto();

this.clearItems();
                                        });

                                    this.hideMainSpinner();
                                    this.primengTableHelper.isLoading = false;
                                    paytransForm.resetForm();
                                    localStorage.removeItem('attachId');
                                    localStorage.clear();

                                    this.refresh();
                                    this.hidesla = this.hidesla;
                                } else {
                                    this._opex
                                        .updatePaymentTransaction(this.paytrans)
                                        .pipe(
                                            finalize(() => {
                                                this.saving = false;
                                            })
                                        )
                                        .subscribe(() => {
                                            this.message.info(
                                                'Updated Successfully'
                                            );
                                            this.paytrans = new CreatePaymentTransactionDto();
                                            //this.loadPayTransaction();
                                            this.loadPendingTransaction();
                                            // this. getOpexTotalAmount();
                                            this.CalculateBudgetUsedforMIS();
                                            this.getLoginUserMis();
                                            this.saving = false;
                                        });
                                    this.hideMainSpinner();
                                    this.primengTableHelper.isLoading = false;
                                    paytransForm.resetForm();
                                    this.refresh();
                                }
                            }
                        }
                    );
                } else {
                    if (this.paytrans.id == null) {
                        this.message.confirm(
                            'You Want To Proceed With This Request',
                            this.l('AreYouSure'),
                            (isConfirmed) => {
                                if (isConfirmed) {
                                    this.showMainSpinner();
                                    this.primengTableHelper.isLoading = true;
                                    this.saving = true;

                                    this._opex
                                        .initiateRequest(this.paytrans)
                                        .pipe(
                                            finalize(() => {
                                                this.saving = false;
                                            })
                                        )
                                        .subscribe((r) => {
                                            // this.notify.info(this.l('SavedSuccessfully'));
                                            this.message.info(
                                                this.l(
                                                    'Saved Successfully  With'
                                                ) +
                                                    ' Ref: ' +
                                                    r
                                            );
                                            this.paytrans = new CreatePaymentTransactionDto();
                                            this.clearItems();

                                        });

                                    this.hideMainSpinner();
                                    this.primengTableHelper.isLoading = false;
                                    paytransForm.resetForm();
                                    localStorage.removeItem('attachId');
                                    localStorage.clear();
                                    this.refresh();
                                    this.hidesla = this.hidesla;
                                }
                            }
                        );
                    } else {
                        this._opex
                            .updatePaymentTransaction(this.paytrans)
                            .pipe(
                                finalize(() => {
                                    this.saving = false;
                                })
                            )
                            .subscribe(() => {
                                this.message.info('Updated Successfully');
                                this.paytrans = new CreatePaymentTransactionDto();
                                //this.loadPayTransaction();
                                this.loadPendingTransaction();
                                //this. getOpexTotalAmount();
                                this.CalculateBudgetUsedforMIS();
                                this.getLoginUserMis();
                                this.saving = false;
                            });
                        this.hideMainSpinner();
                        this.primengTableHelper.isLoading = false;
                        paytransForm.resetForm();
                        this.refresh();
                    }
                }
            });
        // this.paytranslist.push(this.paytrans);

        this.primengTableHelper.isLoading = false;
        this.uploadStatus = false;
    }

    checkIsSimiliarRequestExist(f: CreatePaymentTransactionDto) {}

    loadPayTransaction() {
        this.primengTableHelper.showLoadingIndicator();
        this._opex
            .getPaymentTransaction()
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.length;
                if (this.primengTableHelper.totalRecordsCount > 0) {
                    this.saveButtonDisabled = true;
                    this.initiateButtonDisable = false;
                } else {
                    this.saveButtonDisabled = false;
                    this.initiateButtonDisable = true;
                }
                this.primengTableHelper.records = result;

                this.primengTableHelper.hideLoadingIndicator();

                result.forEach((x) => {
                    if (x.payeeTypeId === 3) {
                        this.hideMultiBeneficiarmodal = true;
                    } else {
                        this.hideMultiBeneficiarmodal = false;
                    }

                    this.records = result;
                });
            });
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

                if (resultvalue === true) {
                    this.saveButtonDisabled = false;

                    return this.saveButtonDisabled;
                }
                if (resultvalue === false) {
                    this._opex.isrecordexistforuser().subscribe((result) => {
                        let vvv = result;

                        if (vvv === false) {
                            this.saveButtonDisabled = false;
                        } else {
                            this.saveButtonDisabled = true;
                        }
                    });
                }
            });
    }

    add(id?: any, amount?: any) {
        //let id = 0;

        this.taxTransactionModal.show(id, amount);

        this.taxtransprimengTableHelper.showLoadingIndicator();
        this._opex
            .getTaxTransaction(id)
            .pipe(
                finalize(() =>
                    this.taxtransprimengTableHelper.hideLoadingIndicator()
                )
            )
            .subscribe((result) => {
                this.taxtransprimengTableHelper.records = result;

                this.taxtransprimengTableHelper.hideLoadingIndicator();
            });
    }

    addsplitcost(
        id?: any,
        amt?: number,
        transactiontypeid?: any,
        period?: any
    ) {
        //let id = 0;

        if (this.grossAmount <= 0) {
            this.message.warn('Amount to be splitted cannot be 0');
            return;
        }
        this.splitCostModal.show(
            id,
            this.grossAmount,
            transactiontypeid,
            period,
            this.currencyRate
        );

        this.splitcostprimengTableHelper.showLoadingIndicator();
        this._opex
            .getsplitcostList(id)
            .pipe(
                finalize(() =>
                    this.splitcostprimengTableHelper.hideLoadingIndicator()
                )
            )
            .subscribe((result) => {
                this.splitcostprimengTableHelper.records = result;

                this.splitcostprimengTableHelper.hideLoadingIndicator();
            });
    }

    addaccrual(
        id: any,
        transactiontype: string,
        amount: any,
        requestNumber: string
    ) {
        //let id = 0;

        this.opexAccrualModal.show(id, transactiontype, amount, requestNumber);

        this._accrualservice
            .getUtilizedAccrualByRef(transactiontype)
            .subscribe((result) => {
                this.accrualdetailList = result;
            });
    }

    addmultibeneficiary(id: any, amount: any) {
        this.multipleBeneficiaryModal.show(id, amount);
    }

    addworkflowroute() {
        this.opexWorkflowRouteModal.show();
    }

    showEditModal(record: PaymentTransactionDto) {
        this.opexPendingTaskTab.show(record);
    }
    edit(f: CreatePaymentTransactionDto): void {
        this.paytrans.madeBy = f.madeBy;
        this.paytrans.id = f.id;
        this.paytrans.tenantId = f.tenantId;
        this.paytrans.narration = f.narration;
        this.paytrans.operationId = f.operationId;

        this.paytrans.payeeTypeId = f.payeeTypeId;
        this.paytrans.requestDate = f.requestDate;
        this.paytrans.requestNumber = f.requestNumber;
        this.paytrans.taxAmount = f.taxAmount;
        this.paytrans.transactionTypeId = f.transactionTypeId;
        this.paytrans.whtAmount = f.whtAmount;
        this.paytrans.amount = f.amount;
        this.paytrans.invoiceNumber = f.invoiceNumber;
        this.paytrans.currency = f.currency;
        this.paytrans.invoiceDate = f.invoiceDate;
        this.startdate = f.invoiceDate.toJSDate();

        this.saveButtonDisabled = !this.saveButtonDisabled;

        this.getNamee(f.payeeTypeId);
        this.paytrans.payeeName = f.payeeName;
    }

    delete(accmap: PaymentTransactionDto): void {
        this.message.confirm(
            this.l('Do you want to cancel this request?', accmap.invoiceNumber),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._workflowService
                        .cancelPaymentTrasactionByRef(
                            accmap.requestNumber,
                            accmap.operationId
                        )
                        .subscribe(() => {
                            this.loadPendingTransaction();
                            this.notify.success(
                                this.l('Successfully Cancelled')
                            );
                            this.refresh();
                            //this.getOpexTotalAmount();
                        });
                }
            }
        );
    }

    getBudget(transactiontype: any) {
        this._opex
            .checkLoginUserTransOrGlBudget(transactiontype)
            .subscribe((result) => {
                this.calculatebuget = result;
            });
    }

    getAttach() {
        let getJSON = localStorage.getItem('attachId');
        if (getJSON) {
            localStorage.setItem('attachId', getJSON);
            this.attachId = JSON.parse(getJSON);
        }
    }

    checkLocalstorage() {
        localStorage.removeItem('attachId');
                                    localStorage.clear();
        this.getAttach();
        if (this.attachId === null || this.attachId === undefined) {
            this._cashAdvance.getAttachId().subscribe((x) => {
                let sendJSON = JSON.stringify(x);
                this.attachId = x;
                localStorage.setItem('attachId', sendJSON);
            });
        }
        this.paytrans.attachId = this.attachId;
    }

    loadPendingTransaction() {
        this.primengTableHelper.showLoadingIndicator();
        this._opex
            .getPendingOpexTransactions()
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.length;

                this.primengTableHelper.records = result;

                this.primengTableHelper.hideLoadingIndicator();

                result.forEach((x) => {
                    if (x.payeeTypeId === 3) {
                        this.hideMultiBeneficiarmodal = true;
                    } else {
                        this.hideMultiBeneficiarmodal = false;
                    }

                    this.records = result;
                });
            });
    }

    togglech(event) {
        this.hidesla = !this.hidesla;
        this.paytrans.applyPrepayments = this.hidesla;
        this.paytrans.prepaymentStartDate = this.sampleDateRange[0];
        this.paytrans.prepaymentEndDate = this.sampleDateRange[1];
    }

    benName() {
        this._cashAdvance.getLoginName().subscribe((result) => {
            this.paytrans.payeeName = result;
            this.getPayeeBankDetails(result);
        });
    }

    handleChangeTax() {

        this.vatValue = 0;
        this.vatValue2 = 0;
        this.VATRate = 0;
       // this.isVATonTotal = true;

        if (this.isTaxRequired) {
            this.VATRate = this.vatTransaction.rate;
        }
        this.validateAmount(this.taxableAmount, 1);

    }

    handleChange(e) {
        if (e.checked === true) {
            this.hidesla = !this.hidesla;
            this.paytrans.applyPrepayments === e.checked;
        } else {
            this.paytrans.applyPrepayments === e.checked;
            this.hidesla = false;
        }
    }
    gettaxation() {
        this._opex.getApprovedTaxationActive().subscribe((items) => {
            this.VATList = items
                .filter((x) => x.witholding === false && x.isDefault)
                .sort();
            this.WHTList = items.filter((x) => x.witholding === true).sort();
            this.vatTransaction = this.VATList.pop();
            this.VATRate = this.vatTransaction.rate;
        });
    }
    getWHTValue(id) {
        this.WHTRate = 0;

        if (id > 0) {
            this.WHTRate = this.WHTList.filter((x) => x.id === id)[0].rate;
        }
        this.effectAmount(this.WHTRate, 2, 0);
    }

    resetAmount(id) {
        if (id === 1) {
            this.taxableAmount = this.paytrans.amount;
        }
        if (id === 2) {
            this.taxableAmountWHT = this.paytrans.amount;
        }
    }

    effectAmount(event, id, tid) {
        let vat = 0;
        let wht = 0;

        let tItem = new CreateTaxTransactionDto();
        let tItemw = new CreateTaxTransactionDto();

        if (id === 2) {
            if (
                this.taxableAmountWHT === 1 ||
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
            tItem.paymentId = this.attachId;
            tItem.isPayeeBearer = this.isWHTonPayee;
            this.AddTaxItem(tItem);
            this.paytrans.whtAmount = this.whtValue2;
        }
        if (id === 3) {
            if (
                this.taxableAmount === 1 ||
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
            tItem.paymentId = this.attachId;
            this.AddTaxItem(tItem);
            this.paytrans.taxAmount = this.vatValue2;

            //  this.vatValue2 = (this.vatValue / 100) * Number(this.taxableAmount);
            //  this.whtValue2 = (this.whtValue / 100) * Number(this.taxableAmount);
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

        if (type === 0) {
            this.validateAmount(event, 1);
            this.validateAmount(event, 2);
        }

        if (type === 1) {
            if (Number(event) > Number(this.paytrans.amount)) {
                this.taxableAmount = 0;
                this.message.warn(
                    'Taxable amount cannot be greater than specified amount!'
                );

                return;
            }

            this.taxableAmount = event;
            this.effectAmount(this.VATRate, 3, 0);
        }
        if (type === 2) {
            if (Number(event) > Number(this.paytrans.amount)) {
                this.taxableAmountWHT = 0;
                this.message.warn(
                    'Taxable amount cannot be greater than specified amount!'
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
                (x) => x.coycode === item.coycode
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

    /*  async getPayeeBankDetails(event) {
        if (event == null) {
            return;
        }
        let bTypeId = 3;
        this.benDisabled = true;
        if (this.paytrans.payeeTypeId !== 1) {
            bTypeId = 2;
            this.benDisabled = false;
        }

        this.benBankDetailList = [];

  if (bTypeId == 3) {

          this._opex.getBeneficiaryDetails(bTypeId, event).subscribe((x) => {
            if (x.length == 0) {
                this.benBankDetailList = [];
                this.benBankDetailId = 0;
                this.paytrans.payeeName = "";
                this.message.error(
                    "Kindly contact administrator to maintain bank details of the payee",
                    "Missing Bank Details"
                );
            } else {
                this.benBankDetailList = x;
                this.benBankDetailId = x[0].id;
            }
        });

      }
    } */

    async getPayeeBankDetails(event) {
        if (event == null) {
            return;
        }

        let bTypeId = 3;
        this.benDisabled = true;
        if (this.paytrans.payeeTypeId !== 1) {
            bTypeId = 2;
            this.benDisabled = false;
        }

        if (event === 101) {
            this.showUnRegisteredVendorOpex();
            return;
        }

        this.benBankDetailList = [];

        if (
            this.paytrans.payeeTypeId === 1 ||
            this.paytrans.payeeTypeId === 4 ||
            this.paytrans.payeeTypeId === 2
        ) {
            this._opex.getBeneficiaryDetails(bTypeId, event).subscribe((x) => {
                if (x.length === 0) {
                    this.benBankDetailList = [];
                    this.benBankDetailId = 0;
                    this.paytrans.payeeName = '';
                    this.message.error(
                        'Kindly contact administrator to maintain bank details of the payee',
                        'Missing Bank Details'
                    );
                } else {
                    this.benBankDetailList = x;
                    this.benBankDetailId = x[0].id;
                }
            });
        }
    }
    CheckRate() {
        this.RateDescription = 'Rate: ';
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
                                        c.defaultCurrencyCode ===
                                            x.currencyCode &&
                                        c.exchangeCurrencyCode ===
                                            this.paytrans.currency
                                ).exchangeRate;
                            } catch (error) {}

                            if (y === 0) {
                                this.RateDescription = 'Rate not setup';
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

    showUnRegisteredVendorOpex() {
        this.createVendorOpexModal.show();
    }

    getAllVendorList() {
        this.getListOfVendors = [];
        this._opex.getAllListOfVendors().subscribe((result) => {
            that.getListOfVendors = result;
        });
    }

    getAllUnregisteredVendor(callback = () => {}) {
        this.getNamee(4);
        callback();
    }

    getMultipleBeneficiaryTotalAmount(amt) {
        this.paytrans.amount = amt;
        this.validateAmount(amt, 1);
        this.validateAmount(amt, 2);
    }

    getVendorNumberItem(vendorNumberItem: string) {
        this.benBankDetailId = 1;
        this._opex.getBeneficiaryDetails(2, vendorNumberItem).subscribe((x) => {
            if (x.length === 0) {
                this.benBankDetailList = [];
                this.benBankDetailId = 0;
                this.paytrans.payeeName = '';
                this.message.error(
                    'Kindly contact administrator to maintain bank details of the payee',
                    'Missing Bank Details'
                );
            } else {
                this.getAllUnregisteredVendor(() => {
                    this.paytrans.payeeName = x[0].beneficiaryName;
                    this.benBankDetailList = x;
                    this.benBankDetailId = x[0].id;
                });
            }
        });
    }


    loadTopStatsData() {
        this.primengTableHelper.isLoading = true;
        this._tenantDashboardServiceProxy.getWorkflowTopStats(7,42,0).pipe(
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
