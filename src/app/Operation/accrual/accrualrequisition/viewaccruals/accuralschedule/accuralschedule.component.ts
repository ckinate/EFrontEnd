import {
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { AccrualServiceServiceProxy, AccurualScheduleDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { Position } from "ngx-perfect-scrollbar";
import * as XLSX from 'xlsx';


@Component({
    selector: "accuralschedule",
    templateUrl: "./accuralschedule.component.html",
    styleUrls: ["./accuralschedule.component.css"],
})
export class AccuralscheduleComponent
    extends AppComponentBase
    implements OnInit {
    updateForm: NgForm;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("ViewSchedule", { static: true }) modal: ModalDirective;

    active = false;
    saving = false;
    accurualschedule: AccurualScheduleDto = new AccurualScheduleDto();
    amounttoposted: number = 0;
    fileName= 'AccurualSchedule.xlsx';
    schedule: string;
    items: AccurualScheduleDto[] = [];
    constructor(
        injector: Injector,
        private _accservice: AccrualServiceServiceProxy,
        ) {
        super(injector);
    }

    ngOnInit(): void {}

    show(f: string): void {

        this.active = true;
        const self = this;
        self.active = true;
        this.primengTableHelper.showLoadingIndicator();
        this._accservice
            .getAccrualSchedule(f)
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.primengTableHelper.records = result;
                this.primengTableHelper.hideLoadingIndicator();
                // console.log(result);

            });
        self.modal.show();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

    newedit(f: AccurualScheduleDto): void {
        this.amounttoposted = f.amount;
        this.accurualschedule.transactionNarration = f.transactionNarration;
    }

    saveSchedule(){
      /*   var items = this.primengTableHelper.records;
        if (items[0]. > 0){

        } */
        this.schedule = JSON.stringify(this.primengTableHelper.records);
        this.accurualschedule.listdata = this.schedule;
        this._accservice
        .updateAccurualschedule(this.accurualschedule)
        .subscribe(() => {
         this.notify.info('Updated Successfully');
         this.close();
       });
      // console.log(this.primengTableHelper.records);
    }

    showalert(){
        this.message.error(this.l('This Schedule has already been executed in the past month!'));
    }

    exportexcel(){
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
