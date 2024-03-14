import {
    AfterViewInit,
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    AccrualRequisitionDetailsDto,
    AccrualServiceServiceProxy,
    ChartOfAccountDto,
    ChartofAccountServiceServiceProxy,
    CompanyStructureDto,
    CompanyStructureServiceProxy,
    DefaultAccountDetailsServiceServiceProxy,
    NewAccuralRequisitionDto,
    OperatingExpenseServiceServiceProxy,
    TransactionTypeDto,
    UnitViewDto,
} from "@shared/service-proxies/service-proxies";
import { DateTime } from "luxon";
import { ModalDirective } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";

@Component({
    selector: "createmodal",
    templateUrl: "./createmodal.component.html",
    styleUrls: ["./createmodal.component.css"],
})
export class CreatemodalComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("Createmodal", { static: true }) modal: ModalDirective;
    active = false;
    saving = false;
    amounttoposted: number = 1.0;
    minimumamount: number = 0.0;
    results: string;
    sampleDateRange: DateTime[];
    sampleDate = new Date();
    departList: CompanyStructureDto[] = [];
    newdate: number;
    accreqdetails: AccrualRequisitionDetailsDto[] = [];
    accrualrequisition: NewAccuralRequisitionDto = new NewAccuralRequisitionDto();
    chartOfAcct: ChartOfAccountDto[] = [];
    transactionType: TransactionTypeDto[] = [];
    accrualForm: NgForm;
    unRefresh: Function;
    mindate = new Date();
    isRangeExceeded = false;
    maxdate = new Date(new Date().getFullYear(), new Date().getMonth() , 28);;

    unitDetail = new UnitViewDto();
    unitDetails: UnitViewDto[] = [];



    constructor(
        injector: Injector,
        private _dateTimeService: DateTimeService,
        private _getChartOfAcct: ChartofAccountServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _department: CompanyStructureServiceProxy,
        private _accservice: AccrualServiceServiceProxy,
        private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadChartofAccount();
        this.loadTransactionType();
        this.getDepartments("");

/*         var currentYear = (new Date).getFullYear();
        var currentMonth = (new Date).getMonth();
       var maxdate = new Date(currentYear, currentMonth, 28);
       var newMindate = new Date(currentYear, currentMonth, 1);
       this.maxDate = maxdate;
       this.newmindate = newMindate; */
    }
    ngAfterViewInit(): void {}

    onShown(): void {}

    close(): void {
        this.unRefresh();
        this.modal.hide();
        this.active = false;
    }
    getDepartments(search: any) {
        this._department.getAllBusinessUnits(search).subscribe((s) => {
            this.departList = s.items;
        });
    }
    show(refresh: Function): void {
        this.active = true;
        const self = this;
        self.active = true;
        self.modal.show();
        this.unRefresh = refresh;
    }

    loadChartofAccount() {
        this._getCAChartDefault
            .getDefaultAccountListByCode("014")
            .subscribe((items) => {
                this.chartOfAcct = items;
            });
    }
    loadTransactionType() {
        this._opex.getTransactionType().subscribe((result) => {
            this.transactionType = result;
        });
    }

    save(accrualForm: NgForm) {
      var getday = this.sampleDate.getDate();
        if(getday > 28){
            this.message.error("You cannot select beyond 28th day of the month");
        }else if(this.sampleDateRange ==undefined || this.sampleDateRange == null){
            this.message.error("Select a Date Range");
        }else{
        this.saving = true;
        debugger;
        this.departList = this.departList.filter(
            (proj) => proj.customCode === this.accrualrequisition.mis
        );
        this.departList.forEach((i) => {
            this.unitDetail.id = i.id;
            this.unitDetail.name = i.customCode;
        });

        let i: UnitViewDto[] = [];
        i.push(this.unitDetail);
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
                i = [];
                this.getDepartments("");
                this.saving = false;
                return;
            } else {
                this.newdate = this.sampleDate.getDate();
        this.accrualrequisition.amounttoposted = this.amounttoposted;
        this.accrualrequisition.startDate = this.sampleDateRange[0];
        this.accrualrequisition.endDate = this.sampleDateRange[1];
        this.accrualrequisition.anniversarydate = this.newdate;
        var startDate = this.accrualrequisition.startDate;
        var endDate = this.accrualrequisition.endDate;
        var aniversaryD = this.sampleDate;
        var newaccuralGL = this.accrualrequisition.accuralGL.split("-");
        var newtransactiontype = this.accrualrequisition.transactiontype.split(
            "-"
        );

        var newaccuralGLcode = newaccuralGL[1];
        var newtransactiontypecode = newtransactiontype[1];
        const listDate = this.DateRange(
            startDate.toString(),
            endDate.toString(),
            aniversaryD.toString(),
            this.amounttoposted,
            newaccuralGLcode,
            newtransactiontypecode
        );
        this.accrualrequisition.accuralGL = newaccuralGL[0];
        this.accrualrequisition.transactiontype = newtransactiontype[0];
        const listDatestr = JSON.stringify(listDate);
        this.accrualrequisition.listDateData = listDatestr;

        if (this.isRangeExceeded) {
            this.message.confirm(
                this.l("Do you want to proceed?"),
                this.l(
                    "Please, Not all Dates within the Date Range contains the Anniversary Day!"
                ),
                (isConfirmed) => {
                    if (isConfirmed) {
                        this.callApi(this.accrualrequisition);
                        accrualForm.resetForm();
                    } else {

                        this.saving = false;
                        return;
                    }
                }
            );
        } else {
            this.callApi(this.accrualrequisition);
            this.getDepartments("");
            accrualForm.resetForm();
        }
            }
        },(error)=>{
            this.saving = false;
        });
        }
    }
    //
    callApi(item: NewAccuralRequisitionDto) {
        this._accservice
            .createNewAccrualRequisition(item)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l("Saved Successfully"));
                this.accrualrequisition = new NewAccuralRequisitionDto();
                this.close();
            });
    }


    DateRange( startDate: string,
        endDate: string,
        aniversaryD: string,
        amount: number,
        accuralGLcode: string,
        transactiontypecode: string) {
        var StartDate = new Date(startDate);

        var EndDate = new Date(endDate);

        var aniversaryDate = new Date(aniversaryD);

        var startM = StartDate.getMonth(); //0
        var endM = EndDate.getMonth(); //11
        var finalRangeDate = ((EndDate.getFullYear() - StartDate.getFullYear()) * 12) + (endM - startM); //11
        var range = 0;
        console.log(EndDate.getFullYear() - StartDate.getFullYear());
        console.log(finalRangeDate);
        var counter = 0;
        var getEndYear = StartDate.getFullYear();
        var month = startM;

        const lstResult = [];
        for (var i = 0; i <= finalRangeDate; i++) {
          var getAniversaryDay = aniversaryDate.getDate();


          if ((i + startM )/ (counter +1) === 12) {
            counter++;
            //startM = 0;
            month = 1;
            getEndYear++;
          } else{
            month++;
          }

          var days =this.getTotal(month,getEndYear);

          if(getAniversaryDay > days){
            getAniversaryDay = days;
          }

          const resultItem: string =
            getEndYear.toString() +
            "-" +
            (month <= 9 ? "0" + month.toString() : month.toString()) +
            "-" +
            getAniversaryDay.toString();
          // Perform Operation
          const item = {
            transactionDate: resultItem,
            transactionNaration: `Accural Requistion for ${this.getMonth(
                month
            )}`,
            creditGL: accuralGLcode,
            debtGL: transactiontypecode,
            amount: amount,
            status: "pending",
            isExcuted: false,
        };
        lstResult.push(item);
        }
        return lstResult;
      }

    getTotal(month, year) {
        return new Date(year, month, 0).getDate();
    }

    getMonth(month: number): string {
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        var monthName = months[month - 1];
        return monthName;
    }


}
