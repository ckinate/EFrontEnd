import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
  ApiIntegrationsServiceProxy,
  BankDto,
  BankServiceServiceProxy,
    PaymentBeneficiary,
    UsersCategoryDto,
    UsersCategoryServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import * as XLSX from "xlsx";

@Component({
    selector: "app-otherbeneficiary",
    templateUrl: "./otherbeneficiary.component.html",
    styles: [],
})
export class OtherbeneficiaryComponent
    extends AppComponentBase
    implements OnInit {
    itemList: PaymentBeneficiary[] = [];
    item = new PaymentBeneficiary();
    isEdit = false;
    bankList:  BankDto[] = [];
    catList: UsersCategoryDto[] = [];
    saving = false;
    fileName= 'OtherBeneficiarySetUp.xlsx';

    @ViewChild('modal', { static: true }) modal: ModalDirective;

    constructor(
        injector: Injector,
        private _benOtherPayment: UsersCategoryServiceServiceProxy,
        private _ben: BankServiceServiceProxy,
        private _accountVerification: ApiIntegrationsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {

      this.item.bankCode ="0";
      this.item.categoryId = 0;
        this.getUsers();
        this.getAllBankList();
        this.getCategoryList();
    }



    getUsers() {
      this._benOtherPayment.getPaymentBeneficiary().subscribe()
        this._benOtherPayment.getPaymentBeneficiary().subscribe(x => {
            this.primengTableHelper.records = x;
            this.primengTableHelper.totalRecordsCount = x.length;
            console.log(x);
        });
    }


    keyPressNumbersDecimal(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31
          && (charCode < 48 || charCode > 57)) {
          event.preventDefault();
          return false;
      }
      return true;
  }

  getAllBankList(){
      this._ben.getBankList().subscribe((result) => {
          this.bankList = result;
      });
  }



  onShown(){

  }

  close(){
    this.modal.hide();
  }
  createUser(){
    this.modal.show();
  }
  getCategoryList() {
    this._benOtherPayment.getUserCatList().subscribe(v => {
      this.catList = v;
    })
  }
    saveBeneficiary() {



      this.primengTableHelper.isLoading = true;


 if (this.item.email===undefined|| this.item.email==null) {
   this.item.email="noemail";
 }



 if(this.item.accountName !==''){
   this._accountVerification.getAccountNameByAccountNumberBankCode(this.item.accountNumber, this.item.bankCode)
   .pipe(finalize(() => {
    this.primengTableHelper.isLoading = false
  }))
   .subscribe( x => {

      if(x.toLowerCase() == this.item.accountName.toLowerCase()){

        if (this.isEdit) {
          this.updateRecord(this.item);
        }else {
          this._benOtherPayment.createPaymentBeneficiary(this.item)
          .pipe(finalize(() => {
            this.primengTableHelper.isLoading = false
          })).subscribe(v => {
            this.message.success("Beneficiary created and sent for approval","Beneficiary Profiling");

            this.getUsers();
            this.close();
            this.item = new PaymentBeneficiary();
          });

        }
      } else{
        this.message.error("Invalid entry. Name mismatch " + x,"Account Validation");
      }



   });
 }



    }

    updateRecord(item: PaymentBeneficiary) {
      this._benOtherPayment.updatePaymentBeneficiary(item).pipe(finalize(() => {
        this.primengTableHelper.isLoading = false
      })).subscribe(v => {

        this.message.success("Beneficiary updated and sent for approval","Beneficiary Profiling");


        this.getUsers();
        this.close();

        this.item = new PaymentBeneficiary();
      });

    }

    ActiveStatus( record: PaymentBeneficiary, state: boolean){

     record.active = state;
     this.updateRecord(record);

    }


    EditRecord(record){

      this.isEdit = true;
this.item = record;
      this.modal.show();


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
