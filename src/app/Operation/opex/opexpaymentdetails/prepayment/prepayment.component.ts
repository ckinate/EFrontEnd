import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    Injector,
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import {
    PrepaymentServiceServiceProxy,
    PrepaymentDetailDto,
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/common/app-component-base";
import { initOffset } from "ngx-bootstrap/chronos/units/offset";
import * as XLSX from "xlsx";

@Component({
    selector: "prepaymentdetail",
    templateUrl: "./prepayment.component.html",
    styleUrls: ["./prepayment.component.css"],
})
export class PrepaymentComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    pData: PrepaymentDetailDto[] = [];
    amortizedTotal = 0;
    amortizing = 0;
    isEdit: boolean = false;
    fileName = "ExcelSheet.xlsx";
    hidecolumn: boolean;
    hidecolumn2: boolean;
    constructor(
        injector: Injector,
        private _service: PrepaymentServiceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {}

    SetEdit() {
        this.isEdit = !this.isEdit;
    }
    show(Id: any, amount: number): void {
        this.amortizing = amount;
        this.getPrepaymentDetails(Id);
        this.modal.show();
    }

    close(): void {
        this.amortizedTotal = 0;
        this.modal.hide();
    }
    getPrepaymentDetails(id: any) {
        this.pData = [];
        this._service.getPrepaymentTransactionSchedule(id).subscribe((x) => {
            this.pData = x;

            for (let data of this.pData) {
                this.amortizedTotal += data.amount;
            }
            var diff = this.amortizing - this.amortizedTotal;
            this.amortizedTotal += diff;
            return this.amortizedTotal;
        });
    }
    saveSchedule() {
        // this.getTotalAmount();

        if (this.amortizedTotal.toFixed(2) == this.amortizing.toFixed(2)) {
            this._service
                .createOrEditPrepaymentDetailTransaction(this.pData)
                .subscribe(() => {
                    this.notify.success("Prepayment schedule set");
                    this.close();
                });
        } else {
            this.message.error(
                "Amount amortizing (" +
                    this.amortizing.toFixed(2) +
                    ") is not equal to amount amortized (" +
                    this.amortizedTotal.toFixed(2) +
                    ")",
                "Amortization Difference Error"
            );
            return;
        }
    }

    getTotalAmount() {
        let total = 0;
        for (let data of this.pData) {
            this.amortizedTotal += data.amount;
        }
        return this.amortizedTotal;
        //this.amortizedTotal = this.pData.map(t => Number(t.amount)).reduce((acc, value) => Number(acc) + Number(value), 0);
    }

    onShown(): void {}

    revalidate() {
        this.amortizedTotal = this.pData.reduce(
            (sum, current) => sum + current.amount,
            0
        );
    }

    exportexcel() {
        /* table id is passed over here */
        debugger;
        // this.hidecolumn=false;
        let element = document.getElementById("excel-table");
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}
