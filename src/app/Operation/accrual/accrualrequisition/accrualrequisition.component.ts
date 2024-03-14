import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Injector,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    AccrualPeriodDto,
    AccrualRequisitionDetailsDto,
    AccrualServiceServiceProxy,
    ActiveAccrualPeriodDto,
    ChartOfAccountDto,
    ChartofAccountServiceServiceProxy,
    CompanyStructureDto,
    CompanyStructureServiceProxy,
    CreateAccrualRequisitionDetailsDto,
    CreateAccrualRequisitionDto,
    NewAccuralRequisitionDto,
    OperatingExpenseServiceServiceProxy,
    PostDto,
    PostItem,
    PostResultDto,
    TransactionTypeDto,
} from "@shared/service-proxies/service-proxies";
import { DateTime } from "luxon";
import * as moment from "moment";
import { getMonth } from "ngx-bootstrap/chronos";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
import * as XLSX from "xlsx";
import { AccrualviewdetailsmodalComponent } from "./viewaccruals/accrualviewdetailsmodal/accrualviewdetailsmodal.component";
import { AccuralscheduleComponent } from "./viewaccruals/accuralschedule/accuralschedule.component";
import { CreatemodalComponent } from "./viewaccruals/createmodal/createmodal.component";

var that;
@Component({
    templateUrl: "./accrualrequisition.component.html",
    styleUrls: ["./accrualrequisition.component.css"],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class AccrualrequisitionComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit {
    @ViewChild("accrualViewDetailsmodal", { static: true })
    accrualViewDetailsmodal: AccrualviewdetailsmodalComponent;

    @ViewChild("dataTable", { static: true }) dataTable: Table;

    @ViewChild("Createmodal", { static: true })
    Createaccrualmodal: CreatemodalComponent;

    @ViewChild("accrualViewschedule", { static: true })
    accrualschedulemodal: AccuralscheduleComponent;

    saving = false;
    chartOfAcct: ChartOfAccountDto[] = [];
    transactionType: TransactionTypeDto[] = [];
    filterText = "";
    accrualForm: NgForm;
    fileName= 'Accrual.xlsx';

    // @ViewChild('paginator', { static: true }) paginator: Paginator;
    primengTableHelper = new PrimengTableHelper();

    amounttoposted: number = 0;
    minimumamount: number = 0.0;
    results: string;
    sampleDateRange: DateTime[];
    sampleDate = new Date();
    departList: CompanyStructureDto[] = [];
    newdate: number;
    isTableVisible: boolean = true;

    constructor(
        injector: Injector,
        //private _opex: OperatingExpenseServiceServiceProxy,
       // private _department: CompanyStructureServiceProxy,
        private _accservice: AccrualServiceServiceProxy,
        public notifier: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        that = this;
        this.loadaccrualrequisition();
        //this.getDepartments("");
    }

    ngAfterViewInit(): void {}

    createUser(): void {
        this.Createaccrualmodal.show(this.loadaccrualrequisition);
    }

    getposition(d: number) {
        if (d > 3 && d < 21) return d.toString() + "th";
        switch (d % 10) {
            case 1:
                return d.toString() + "st";
            case 2:
                return d.toString() + "nd";
            case 3:
                return d.toString() + "rd";
            default:
                return d.toString() + "th";
        }
    }

    loadaccrualrequisition() {
        this.primengTableHelper.showLoadingIndicator();
        this._accservice
            .getNewAccrualRequisition()
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                result = result.sort((n1, n2) => {
                    if (n1.createAt < n2.createAt) {
                        return 1;
                    }

                    if (n1.createAt > n2.createAt) {
                        return -1;
                    }

                    return 0;
                });
                that.primengTableHelper.records = result;
                that.primengTableHelper.hideLoadingIndicator();
                that.notifier.detectChanges();
            });
    }

    ViewSchedule(f: NewAccuralRequisitionDto) {
        this.accrualschedulemodal.show(f.id);
    }
    edit(f: NewAccuralRequisitionDto): void {
        this.accrualViewDetailsmodal.show(f);
    }

    disable(accmap: NewAccuralRequisitionDto, results): void {

        this.message.confirm(
            this.l("Do you want to proceed?"),
            this.l("Terminate Accrual Standing Instruction"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._accservice
                        .disableNewAccuralRequisition(accmap.id, results)
                        .subscribe(() => {
                            // this.reloadPage();
                            this.notify.success(this.l("This operation has been terminated successfully"));
                            this.loadaccrualrequisition();
                        });
                }
            }
        );
    }

    exportToExcel(){
           /* table id is passed over here */
           debugger;
           // this.hidecolumn=false;
             let element = document.getElementById('excel-table');
             const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

             /* generate workbook and add the worksheet */
             const wb: XLSX.WorkBook = XLSX.utils.book_new();
             XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

             /* save to file */
             XLSX.writeFile(wb, this.fileName);
    }
}
