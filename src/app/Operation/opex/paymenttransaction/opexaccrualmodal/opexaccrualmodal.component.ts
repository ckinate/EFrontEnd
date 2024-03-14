import { DecimalPipe } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Theme2ThemeUiSettingsComponent } from "@app/admin/ui-customization/theme2-theme-ui-settings.component";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    AccrualRequisitionDetailsDto,
    AccrualServiceServiceProxy,
    AccrualUtilizationDto,
    CompanyStructureDto,
    CompanyStructureServiceProxy,
    CreateAccrualUtilizationDto,
    ListResultDtoOfCompanyStructureDto,
    OperatingExpenseServiceServiceProxy,
    SumAmountDto,
    UnitViewDto,
} from "@shared/service-proxies/service-proxies";
import { each, filter, forEach } from "lodash";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";

@Component({
    selector: "opexAccrualModal",
    templateUrl: "./opexaccrualmodal.component.html",
    styleUrls: ["./opexaccrualmodal.component.css"],
})
export class OpexaccrualmodalComponent
    extends AppComponentBase
    implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    active = false;

    saving = false;

    accrualdetailList: AccrualRequisitionDetailsDto[] = [];
    accrualdetailListtable: AccrualRequisitionDetailsDto[] = [];
    customCode: string;
    amounttobeposted: number = 0.0;
    abs: number = -1;
    accrualForm: NgForm;
    @ViewChild("accrualdataTable", { static: true }) accrualdataTable: Table;
    accrualprimengTableHelper = new PrimengTableHelper();
    //taxList: TaxationDto[] = [];
    paytransId: any;
    TransactionAmount: 0;
    totalAmount: number;
    refno: string;
    transtypr: string;
    amountUtilizing: any;
    opextotalAmount: any;
    c: string;
    checked: boolean;
    createaccutilization: CreateAccrualUtilizationDto = new CreateAccrualUtilizationDto();
    records: AccrualUtilizationDto[] = [];
    accrualdetailsrecord: AccrualRequisitionDetailsDto[] = [];
    ischecked = false;

    createutilizationlist: CreateAccrualUtilizationDto[] = [];
    opexDetail: AccrualUtilizationDto[] = [];
    companystructureList: CompanyStructureDto[] = [];
    mainRefNo: string;
    totalaccruedamount: any;
    totalutilizingamount: SumAmountDto = new SumAmountDto();
    currencyChars = new RegExp("[.,]", "g");
    paymentRefNo: any;
    accrualdetail: AccrualRequisitionDetailsDto[] = [];
    accrualdetailList2: AccrualRequisitionDetailsDto[] = [];
    Varianceamount: number = 0;
    Refno1: string;
    unitDetail = new UnitViewDto();
    unitDetails: UnitViewDto[] = [];
    isShow = false;
    isVariance = false;

    constructor(
        injector: Injector,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _accrualservice: AccrualServiceServiceProxy,
        private _companystructure: CompanyStructureServiceProxy,
        private notifier: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getCompanyStructure();
        //  this.Varianceamount = this.opextotalAmount - this.totalutilizingamount.sumAmountUtilized
    }

    show(
        id: number,
        transactiontype: string,
        amount: any,
        requestNumber: string
    ): void {
        this.active = true;
        this.paytransId = id;
        this.transtypr = transactiontype;
        this.opextotalAmount = amount;
        this.paymentRefNo = requestNumber;
        this.loadaccrual(transactiontype);
        this.loadaccrualbasedonpaymentid(id);
        this.getTotalAccruedAmount(this.paytransId);

        this.modal.show();
    }

    close(): void {
        this.accrualdetailsrecord = [];
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

    getCompanyStructure() {
        this._companystructure.getCompanyStructures().subscribe((result) => {
            this.companystructureList = result;

        });
    }

    loadaccrual(transactiontype: string) {
        // console.log(transactiontype);
        this._accrualservice
            .getUtilizedAccrualByRef(transactiontype)
            .subscribe((result) => {
                this.accrualdetail = result;
                let uniqueChars = [];
                result.forEach((item, index) => {
                    if (
                        index !== result.findIndex((i) => i.refNo == item.refNo)
                    ) {
                        //uniqueChars.push(item);
                    } else {
                        uniqueChars.push(item);
                    }
                });

                this.accrualdetailList = uniqueChars;
            });
    }

    loadaccrualwithnarration(refno: string) {
        this.Refno1 = "";
        this.accrualdetailList2 = [];
        var resultitem = this.accrualdetail.filter(
            (proj) => proj.refNo === refno
        );
        this.accrualdetailList2 = resultitem;
    }

    loadaccrualdetails(refNo: string) {
        this.checked = false;
        this.mainRefNo = refNo;
        this.isShow = true;
        this.accrualprimengTableHelper.showLoadingIndicator();
        this._accrualservice
            .getAccrualUtilizationByRef(refNo, this.transtypr)
            .subscribe((result) => {

                var resultittems = result.filter(
                    (proj) => proj.amountAccrued === proj.amountUtilizing
                );
                for (var i = 0; i <= result.length; i++) {
                    if (
                        result[i].amountUtilizing === 0 ||
                        result[i].amountUtilizing < 0
                    ) {
                        this.isShow = false;
                        var narration = result[i].narration;
                        this._accrualservice
                            .updateAccrualReqDetails(refNo, narration)
                            .subscribe((result) => {
                                this.accrualdetailsrecord = resultittems;
                                this.loadaccrual(this.transtypr);
                                //this.message.error(this.l("Sorry! Accural Requistion with Reference No: "+ result[i].refNo +' '+"is fully utilized", "Error"))
                                return;
                            },(error)=>{
                                // this.saving = false;
                             });
                    } else {
                        this.accrualdetailsrecord = result;
                    }
                    this.accrualprimengTableHelper.hideLoadingIndicator();
                }

                this.notifier.detectChanges();
            });
    }
    checkedall($event) {
        if ((this.checked = true)) {
            var ittems = this.accrualdetailsrecord;
            //console.log(ittems);
            for (var i = 0; i <= ittems.length; i++) {
                if (ittems[i].benefitingMIS != null) {
                    ittems[i].checked = true;
                    this.checkAdvanceTransaction($event);
                } else {
                    $event.target.checked = false;
                    this.message.error(
                        this.l(
                            "Please Select Benefiting Mis for all the transactions",
                            "Error"
                        )
                    );
                    this.checked = false;
                    return;
                }
            }
        } else {
            this.checked = false;
            ittems[i].checked = false;
            return;
        }
    }

    checkAdvanceTransaction($event) {
        debugger;

        let amount = 0;
        this.opexDetail = [];
        this.createutilizationlist = [];

        var ittem = this.accrualdetailsrecord.filter((el) => el.checked);
        ittem.forEach((xx) => {
            this.opextotalAmount;

            let mmm = (xx.amountUtilizing = parseInt(
                String(
                    xx.amountUtilizing
                        .toString()
                        .replace(this.currencyChars, "")
                )
            ));

            if (
                mmm + this.totalutilizingamount.sumAmountUtilized >
                this.opextotalAmount
            ) {
                const v = xx.amountUtilizing;
                $event.target.checked = false;
                this.message.error(
                    this.l(
                        "Amount Utilizing cannot be greater than the  Opex total amount" +
                            this.opextotalAmount.toString(),
                        "Error"
                    )
                );
                return;
            }
            if (xx.benefitingMIS === undefined) {
                $event.target.checked = false;
                this.message.error(
                    this.l("Please Select Benefiting Mis", "Error")
                );

                return;
            }
            if (xx.amountUtilizing == 0) {
                $event.target.checked = false;
                this.message.error(
                    this.l("Amount Utilizing Cannot Be Zero", "Error")
                );

                return;
            }

            if (xx.amountUtilizing > xx.amountAccrued) {
                $event.target.checked = false;
                this.message.error(
                    this.l(
                        "Amount Utilizing cannot be greater than Amount Accrued",
                        "Error"
                    )
                );

                return;
            }
            if (xx.amountUtilizing < 0) {
                $event.target.checked = false;
                this.message.error(
                    this.l("You've have reached the maximum level", "Error")
                );
               //ss this.isShow = false;
                return;
            }

            let i = new CreateAccrualUtilizationDto();
            debugger;
            i.amountAccrued = xx.amountAccrued;
            i.misAccruedFor = xx.beneficiaryCostCode;
            i.amountUtilizing = this.createaccutilization.amountUtilizing;
            i.benefitingMIS = this.createaccutilization.benefitingMIS;
            i.refNo = this.mainRefNo;
            i.tenantId = abp.session.tenantId;
            i.paymentId = this.paytransId;
            i.benefitingMIS = xx.benefitingMIS;
            i.amountUtilizing = xx.amountUtilizing;
            i.paymentRefNo = this.paymentRefNo;
            i.isFullyUtilized = xx.isFullyUtilized;
            i.narration = xx.narration;
            i.accrualRequisitionDetailsId = xx.id;

            this.createutilizationlist.push(i);
        });
    }

    showalert() {
        this.message.error(
            this.l(
                "Invalid Input! Please refresh the page and Select Reference No",
                "Error"
            )
        );
        return;
    }

    save() {
        if (
            this.createutilizationlist === undefined ||
            this.createutilizationlist.length == 0 ||
            this.refno == undefined
        ) {
            this.message.error(
                this.l(
                    "Sorry! Please Select Reference No or Checked to validate"
                )
            );
        } else {
            this.unitDetails = [];
            //checkforunitrestriction
            this.createutilizationlist.forEach((a) => {
                let n: UnitViewDto = new UnitViewDto();
                n.name = a.benefitingMIS;
                this.unitDetails.push(n);
            });
            this._opex
                .checkforUnitrestriction(this.unitDetails)
                .subscribe((s) => {
                    if (s == true) {
                       /*  this.message.error(
                            this.l(
                                "Some of the Staffs has been restricted! Kindly contact the Administrator"
                            )
                        ); */
                        return;
                    } else {

                        var ittem = this.accrualdetailsrecord.filter(
                            (el) => el.checked
                        ).length;
                        if (ittem == this.accrualdetailsrecord.length) {
                            this.saving = true;
                            this._accrualservice
                                .createAccrualUtilization(
                                    this.createutilizationlist
                                )
                                .pipe(
                                    finalize(() => {
                                        this.saving = false;
                                    })
                                )
                                .subscribe((r) => {
                                    //this.Varianceamount = this.opextotalAmount - this.totalutilizingamount.sumAmountUtilized
                                    this.message.info(
                                        this.l("SavedSuccessfully")
                                    );

                                    this.loadaccrualbasedonpaymentid(
                                        this.paytransId
                                    );
                                    this.createutilizationlist = [];
                                    this.refno = "";
                                    this.Refno1 = "";
                                    this.getTotalAccruedAmount(this.paytransId);
                                   /*  let Variance = this.totalutilizingamount.sumAmountAccrued - this.totalutilizingamount.sumAmountUtilized;
                                    alert(Variance);
                                    if(Variance > 0){

                                        this.isVariance = true;
                                    } */
                                  //  this.isVariance = true;
                                });
                        } else {
                            this.message.error(
                                this.l("Please Checked all Validate", "Error")
                            );
                        }
                    }
                }, (error)=>{
                    this.checked = false;
                    this.saving = false;
                    this.unitDetails = [];
                    this.createutilizationlist = [];
                });
        }
    }

    loadutilization(paymentId: any, refNo: string, paymentRefNo: any) {
        this._accrualservice
            .getAccrualUtilization(paymentId, refNo, paymentRefNo)
            .subscribe((results) => {
                this.records = results;
            });
    }

    loadaccrualbasedonpaymentid(paymentId: any) {
        this._accrualservice
            .getAccrualUtilizationByPaymentId(paymentId)
            .subscribe((result) => {
                this.records = result;
                this.notifier.detectChanges();
            });
    }

    getTotalAccruedAmount(payId: any) {
        this._accrualservice.totalAmountAccrued(payId).subscribe((result) => {
            this.totalutilizingamount = result;
        });
    }

    deleteitem(id: any, items: AccrualUtilizationDto): void {
        this.message.confirm(
            this.l("Do you want to reset this transaction?"),
            this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._accrualservice
                        .updateAccrualUtilization(id)
                        .subscribe(() => {
                            this.records = this.records.filter(
                                (i) => i.id != items.id
                            );
                            this.getTotalAccruedAmount(this.paytransId);
                            this.notify.success(this.l("SuccessfullyDeleted"));
                            this.loadaccrual(this.transtypr);
                        });
                }
            }
        );
    }

    savevariance(totalexpense: number) {
        var newVariance =
            totalexpense - this.totalutilizingamount.sumAmountUtilized;

        if (this.amounttobeposted == 0 || newVariance == 0) {
            this.message.error(
                this.l("Amount Utilizing cannot be Zero", "Error")
            );
            return;
        }
        if (this.amounttobeposted > newVariance) {
            this.message.error(
                this.l(
                    "Amount Utilizing cannot be greater than Variance",
                    "Error"
                )
            );
            return;
        } else {
            let n: UnitViewDto = new UnitViewDto();
            n.name = this.customCode;
            let i: UnitViewDto[] = [];
            i.push(n);
            this._opex.checkforUnitrestriction(i).subscribe((s) => {
                if (s == true) {
                    this.message.error(
                        this.l(
                            "This Staff with MIS Code" +
                                " " +
                                this.unitDetail.name +
                                " " +
                                "has been restricted! Kindly contact the Administrator"
                        )
                    );
                    return;
                }
                else {
                    //this.isVariance = true;
                    this.saving = true;
                    let n = new CreateAccrualUtilizationDto();

                    n.amountAccrued = newVariance;
                    n.misAccruedFor = "Null";
                    n.amountUtilizing = this.amounttobeposted;
                    n.benefitingMIS = this.customCode;
                    n.refNo = "Null";
                    n.tenantId = abp.session.tenantId;
                    n.paymentId = this.paytransId;
                    n.amountUtilized = 0;
                    n.paymentRefNo = this.paymentRefNo;
                    n.isFullyUtilized = false;
                    n.narration = "Null";
                    n.accrualRequisitionDetailsId = 0;

                    this.createutilizationlist.push(n);

                    this._accrualservice
                        .createAccrualUtilizationRemainer(this.createutilizationlist)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                            })
                        )
                        .subscribe((r) => {
                            this.message.info(this.l("SavedSuccessfully"));
                            //newVariance = totalexpense -newVariance + this.amounttobeposted ;

                            this.loadaccrualbasedonpaymentid(this.paytransId);
                            this.getTotalAccruedAmount(this.paytransId);
                            this.amounttobeposted = 0.0;
                            this.createutilizationlist = [];
                            this.getCompanyStructure();
                            this.refno = "";
                            this.Refno1 = "";
                        });
                }

        },(error)=>{
            i = [];
            this.getCompanyStructure();
            this.saving = false;
        })
    }
  }
}
