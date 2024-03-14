import {
    AfterViewInit,
    Component,
    Injector,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { DateTimeService } from "@app/shared/common/timing/date-time.service";

import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import {
    BankPostingMasterTransaction,
    BankPostingTransactionServiceServiceProxy,
    BeneficiaryTransaction,
    OperatingExpenseServiceServiceProxy,
    OperationsDto,
    PostingEntry,
} from "@shared/service-proxies/service-proxies";
import { DateTime } from "luxon";
import { ModalDirective } from "ngx-bootstrap/modal";
import { LazyLoadEvent, Paginator, Table } from "primeng";
import { finalize } from "rxjs/operators";

@Component({
    selector: "app-bankposting",
    templateUrl: "./bankposting.component.html",
    styles: [],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class BankpostingComponent
    extends AppComponentBase
    implements OnInit, AfterViewInit {
    @ViewChild("dataTable", { static: true }) dataTable: Table;
    @ViewChild("paginator", { static: true }) paginator: Paginator;
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    @ViewChild("modaldecline", { static: true }) modaldecline: ModalDirective;

    primengTableHelper = new PrimengTableHelper();
    selectedItem: string[] = [];
    selectedItems: BankPostingMasterTransaction[] = [];
    rmks = "";
    bankBeneficiary: BankPostingMasterTransaction[] = [];
    operations: OperationsDto[] = [];
    sampleDateRange: DateTime[] = [
        this._dateTimeService.getStartOfDayForDate(this._dateTimeService.getStartOfDayMinusDays(3)),
        this._dateTimeService.getEndOfDay(),
    ];
    OperationId: number = 0;
    isDataLoading = false;
    maxDate: any;

    itemLedgerPosting : PostingEntry[] = [];
  
    
    paymentRef ='';
    constructor(
        injector: Injector,
        private _bp: BankPostingTransactionServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
        this.maxDate = new Date();
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    ngOnInit(): void {
        
        this.loadTransaction();
    }

    viewBeneficiary(RefNo) {
        this._opex.getApprovalPaymentDetails(RefNo).subscribe((x) => {
            

            this._bp.getPostingDetailsByRefAndOPID(x.paymentRequest.pVoucherNo, x.paymentRequest.operationId).subscribe((u) => {
                this.itemLedgerPosting = u.ledgerPosting; 
                this.modal.show();       
             });


        });
    }

    onShown(){
        
    }

    getWorkflow(event?: LazyLoadEvent) {}
    loadOperations() {
        this._bp.getUnpostedOperations().subscribe((x) => {
            this.operations = x;
            
        });
    }
    loadTransaction() {
        this.isDataLoading = true;
        this._bp
            .getListOfUnpostedTransactions(
                this.sampleDateRange[0],
                this.sampleDateRange[1],
                this.OperationId
            )
            .pipe(finalize(() => (this.isDataLoading = false)))
            .subscribe((c) => {
                this.bankBeneficiary = c;
                this.primengTableHelper.totalRecordsCount = c.length;                
                this.loadOperations();
                console.log(c);
            });
    }
    close() {
        this.modal.hide();
      }

    selectAll(records: BankPostingMasterTransaction[], e) {
        this.selectedItem = [];

        if (e) {
            records.forEach((f) => {
                this.selectedItem.push(f.refNo);
            });
        }
    }

    singleselect(record, e) {
        if (e) {
            this.selectedItem.push(record.refNo);
        } else {
            let r = this.selectedItem.filter((x) => x !== record.refNo);
            this.selectedItems.filter((x) => x !== record);
        }
        
    }

    PostToFinance(RefNo) {
        this.message.confirm(
            "Are you sure you want to POST this transaction",
            "Post to Finance module",
            (isConfirmed) => {
                if (isConfirmed) {                   
                    
                    this.isDataLoading = true;
                    this._bp.postToFinance(RefNo).pipe(finalize(() => (this.isDataLoading = false)))
                    .subscribe(() => {
                        this.loadTransaction();
                       
                    });
                  
                }
            }
        );
    }
    viewDelineModal(RefNo){
     this.paymentRef = RefNo;
     this.modaldecline.show();
    }
    closeDecline(){
        this.rmks = "";
        this.modaldecline.hide();
    }
    declineTransaction() {
        
        var selectedItem: string[] = [];
        selectedItem.push(this.paymentRef);
            this.message.confirm(
                "Are you sure you want to DECLINE this transaction",
                "Cancel Ledger Posting",
                (isConfirmed) => {
                  if (isConfirmed) {
                    this.showMainSpinner();

                    this._bp
                        .declineTransaction(this.rmks,selectedItem)
                        .pipe(finalize(() => this.hideMainSpinner()))
                        .subscribe(() => {                            
                            this.message.info(
                                "Transaction declined successfully",
                                "Decline transaction"
                            );
                            this.loadTransaction();
                           

                            this.closeDecline();
                        });
                }
              }
            );
      
    }
   
}
