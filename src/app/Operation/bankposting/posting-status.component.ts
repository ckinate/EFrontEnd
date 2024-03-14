import {
    Component,
    Injector,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
    BankPostingMasterTransaction,
    BankPostingTransactionServiceServiceProxy,
    BeneficiaryTransactionStatus,
    OperatingExpenseServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { DateTime } from "luxon";
import { ViewBeneficiaryTransactionAccountsComponent } from "../view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component";
import { LazyLoadEvent, Paginator, Table } from "primeng";
import { finalize } from "rxjs/operators";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
    selector: "app-posting-status",
    templateUrl: "./posting-status.component.html",
    styles: [],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class PostingStatusComponent extends AppComponentBase implements OnInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("viewbeneficiarytransactionaccounts", { static: true })
    viewbeneficiarytransactionaccounts: ViewBeneficiaryTransactionAccountsComponent;
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    @ViewChild("modaldecline", { static: true }) modaldecline: ModalDirective;
    LoadPostingData = false;
    PostedDateRange: DateTime[] = [
        this._dateTimeService.getStartOfDayForDate(
            this._dateTimeService.getStartOfDayMinusDays(3)
        ),
        this._dateTimeService.getEndOfDay(),
    ];
    maxDate: any;
    postedbankBeneficiary: BeneficiaryTransactionStatus[] = [];
    selectedPostedItem: string[] = [];
    selectedItems: BankPostingMasterTransaction[] = [];
    paymentRef = "";
    rmks = "";

    constructor(
        injector: Injector,
        private _dateTimeService: DateTimeService,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _bp: BankPostingTransactionServiceServiceProxy
    ) {
        super(injector);
        this.maxDate = new Date();
    }

    ngOnInit(): void {}

    

    approveTransaction(ref) {


        var selectedItem: string[] = [];
        
        selectedItem.push(ref);
            this.message.confirm(
                "Are you sure you want to POST this transaction",
                "Post to Bank",
                (isConfirmed) => {
                  if (isConfirmed) {
                    this.showMainSpinner();

                    this._bp
                        .postTransaction('Retry', selectedItem)
                        .pipe(finalize(() => this.hideMainSpinner()))
                        .subscribe(() => {
                            
                            var msg = "Transaction sent for processing";
                            this.message.info(msg, "Transaction Posting Retry");
                            this.loadPostedTransaction();
                        },(s) => {
                            selectedItem = [];                           
                            
                            this.loadPostedTransaction();       
                        } 
                        );

                    
                }
              }
            );
        
    }
    declineTransaction() {
        
        var selectedItem: string[] = [];
        selectedItem.push(this.paymentRef);
            this.message.confirm(
                "Are you sure you want to DECLINE this transaction",
                "Post to Bank",
                (isConfirmed) => {
                  if (isConfirmed) {
                    this.showMainSpinner();

                    this._bp
                        .declineTransaction(this.rmks,selectedItem)
                        .pipe(finalize(() => this.hideMainSpinner()))
                        .subscribe(() => {                            
                            this.message.info(
                                "Transactions declined successfully",
                                "Decline transaction"
                            );
                            this.loadPostedTransaction();
                            this.rmks = "";

                            this.closeDecline();
                        });
                }
              }
            );
      
    }
    loadPostedTransaction() {
        this.LoadPostingData = true;
        this.PostedDateRange;
        this._bp
            .getListofTransactionStatus(
                this.PostedDateRange[0],
                this.PostedDateRange[1]
            )
            .pipe(finalize(() => (this.LoadPostingData = false)))
            .subscribe((c) => {
                this.selectedItems = c;
                this.primengTableHelper.totalRecordsCount = c.length;
                console.log(c);
            });
    }
    selectAll(records: BankPostingMasterTransaction[], e) {
        this.selectedPostedItem = [];

        if (e) {
            records.forEach((f) => {
                this.selectedPostedItem.push(f.refNo);
            });
        }
    }
    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    viewDelineModal(RefNo){
        this.paymentRef = RefNo;
        this.modaldecline.show();
    }

    viewBeneficiaryStatus(RefNo) {
        this.paymentRef = RefNo;
        this._bp.getTransactionStatusDetails(RefNo).subscribe((x) => {
            this.postedbankBeneficiary = x;

            this.modal.show();
        });
    }

    singleselect(record, e) {
        if (e) {
            this.selectedPostedItem.push(record.refNo);
        } else {
            let r = this.selectedPostedItem.filter((x) => x !== record.refNo);
            this.selectedPostedItem.filter((x) => x !== record);
        }
    }

    onShown() {}
    close() {
        this.modal.hide();
    }

    closeDecline(){
        this.modaldecline.hide();
    }

    PostToFinance(RefNo) {
        this.message.confirm(
            "Are you sure you want to POST this transaction",
            "Post to Finance module",
            (isConfirmed) => {
                if (isConfirmed) {                   
                    
                    this.LoadPostingData = true;
                    this._bp.postToFinance(RefNo).pipe(finalize(() => (this.LoadPostingData = false)))
                    .subscribe(() => {
                        this.loadPostedTransaction();
                       // this.viewBeneficiaryStatus(this.paymentRef);
                    });
                  
                }
            }
        );
    }
}
