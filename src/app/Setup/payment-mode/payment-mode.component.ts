import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    OperatingExpenseServiceServiceProxy,
    PaymentModeDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { PaymentModeModalComponent } from "./payment-mode-modal/payment-mode-modal.component";
import * as XLSX from "xlsx";
var that;
@Component({
    selector: "app-payment-mode",
    templateUrl: "./payment-mode.component.html",
    styleUrls: ["./payment-mode.component.css"],
})
export class PaymentModeComponent extends AppComponentBase implements OnInit {
    saving = false;
    @ViewChild("apppaymentmodemodal", { static: true })
    apppaymentmodemodal: PaymentModeModalComponent;
    primengTableHelper = new PrimengTableHelper();
    paymentmode: PaymentModeDto[] = [];
    fileName= 'paymentMode.xlsx';

    constructor(
        injector: Injector,
        // private _getChartOfAcct: ChartofAccountServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
        public changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.payeementMode();
    }

    createUser(): void {
       let  item = new PaymentModeDto();
        this.apppaymentmodemodal.show(item);
    }
    edit(item: PaymentModeDto) {
        this.apppaymentmodemodal.show(item);
    }
    disable(Id:number, status: string) {
        this._opex
        .activatePaymentMode(Id, status)
        .subscribe((result) => {
            if (result) {
                this.notify.success(
                    this.l(status + " Successfully")
                );
            } else {
                this.notify.success(
                    this.l(status + " Successfully")
                );
            }
            this.payeementMode();
        });
    }

    payeementMode() {
        this.primengTableHelper.showLoadingIndicator();
        this._opex
            .getPaymentModeList()
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.primengTableHelper.records = result;
                this.changeDetector.detectChanges();
            });
    }

    frontEndExcelExport(){
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
          /* the code here is use to hide the first Column that contain Action from displaying in excel */
        ws['!cols'] = [];
        ws['!cols'][0] = { hidden: true };

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, this.fileName);
      }
}
