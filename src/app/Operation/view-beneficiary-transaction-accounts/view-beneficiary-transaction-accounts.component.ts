import { _isNumberValue } from "@angular/cdk/coercion";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import {
    Component,
    EventEmitter,
    Injector,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/common/app-component-base";
import { BankPostingTransactionServiceServiceProxy, BeneficiaryAccountProfileDto, BeneficiaryPaymentDetailsDto, BeneficiarySplitCostDto, BeneficiaryTransaction, CashAdvanceServiceServiceProxy, OperatingExpenseServiceServiceProxy, PostingEntry } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
    selector: "viewbeneficiarytransactionaccounts",
    templateUrl: "./view-beneficiary-transaction-accounts.component.html",
    styleUrls: ["./view-beneficiary-transaction-accounts.component.css"],
})
export class ViewBeneficiaryTransactionAccountsComponent
    extends AppComponentBase
    implements OnInit {

  misBeneficiary: BeneficiarySplitCostDto[] = [];
  bankBeneficiary: BeneficiaryPaymentDetailsDto[] = [];
  itemLedgerPosting : PostingEntry[] = [];
  itemBankPosting: BeneficiaryTransaction[] = [];
  posting = false;
  transactionRef = '';
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    constructor(injector: Injector, private _bn: OperatingExpenseServiceServiceProxy,
        private _cash: CashAdvanceServiceServiceProxy,

      private _post: BankPostingTransactionServiceServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {}

    show(requestRef, status: string) {
    if(status != 'CashAdvance'){
        this.transactionRef = requestRef;
        this._bn.getSplitCostListByRef(requestRef,0).subscribe( x => {
        this.misBeneficiary = x;

        });

          this._bn.getBankBeneficiaryTransactionDetails(requestRef).subscribe( i => {
          this.bankBeneficiary = i;

        })
    }else{
        this.misBeneficiary = [];
        this.bankBeneficiary = [];
        this._cash.getbeneficiary(requestRef).subscribe( x => {
            let misben = new BeneficiarySplitCostDto();
            misben.amount= x.amount;
            misben.department = x.department;
            misben.departmentName = x.departmentName;
            this.misBeneficiary.push(misben);

            let Benpayment = new BeneficiaryPaymentDetailsDto();
            Benpayment.beneficiaryName = x.beneficiaryName;
            Benpayment.accountNumber = x.accountNumber;
            Benpayment.amount = x.amount;
            Benpayment.bankName = x.bank;
            this.bankBeneficiary.push(Benpayment);
            });

    }
    this.modal.show();
    }

    close() {
      this.modal.hide();
    }
    onShown() {}
    showPosting(request, opid) {
      this.transactionRef = request;

      this.posting = true;

      this._post.getPostingDetailsByRefAndOPID(request, opid).subscribe((u) => {
         this.itemLedgerPosting = u.ledgerPosting;
         this.itemBankPosting = u.bankPosting;

      });
      this.modal.show();

    }


    viewAdvice(request, account){

    let  myURL = AppConsts.reportUrl + "?TypeID=24&RefNo=" + this.transactionRef+ "&account=" + account;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(myURL,"_blank", params);


    }


}
