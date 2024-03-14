import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateTaxTransactionDto, OperatingExpenseServiceServiceProxy, TaxationDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'taxTransactionModal',
  templateUrl: './taxtransactionmodal.component.html',
  styleUrls: ['./taxtransactionmodal.component.css']
})
export class TaxtransactionmodalComponent extends AppComponentBase implements OnInit {

  taxtransactForm : NgForm;
  saving = false;
  chartOfAcct: ChartOfAccountDto[] = [];
  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();


  @ViewChild('transdataTable', { static: true }) transdataTable: Table;
  taxtransprimengTableHelper = new PrimengTableHelper();
  taxList: TaxationDto[] = [];
  paytransactionId: any;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modal' , {static: true}) modal: ModalDirective;

  active = false;
  
  @Output() loadtaxTransaction: EventEmitter<any> = new EventEmitter<any>();

  amount: number = 0;
  rate:number;
  currencyChars = new RegExp('[\.,]', 'g');
  numberFormat:any;

  totalamount:any;
  
  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _opex: OperatingExpenseServiceServiceProxy,
    // private decimalPipe: DecimalPipe
   
    ) {

super(injector);
}

  ngOnInit(): void {
     this.gettaxation();
     this.amount = 0;
  }

  ngAfterViewInit(): void {



  }

  show(id: any,totalAmount:any): void {
    this.active = true;
    this.paytransactionId = id;
    console.log(id);
    
    //this.loadRole(id);
  
   this.totalamount = totalAmount;
    this.loadTaxTransaction(this.paytransactionId);
   
    this.modal.show();
  }
  
  
close(): void {
  this.modal.hide();
  this.active = false;
}

  onShown(): void {

  }


  gettaxation() {
  
    this._opex.getApprovedTaxationActive()
      .subscribe(items => {
        this.taxList = items;
       
  
   
      });
  }

  getRate(taxId: number){
    this._opex.getRate(taxId)
    .subscribe(items => {
      this.rate = items;
      this.taxtrans.rate = this.rate;
     

 
    });

  }

  calculate(rateFromTax: number, taxableAmount:any){
    //  debugger;
    // this.trim(taxableAmount);

    this.numberFormat = parseInt(String(taxableAmount).replace(this.currencyChars, ''));

    
    if(this.numberFormat > this.totalamount){
      this.taxtrans.taxableAmount= null;
      this.taxtrans.amount=null;
      this.message.error(
        "Taxable Amount  (" +
            this.numberFormat.toString() +
            ") cannot be greater than the total amount" +
            this.totalamount.toString(),
        "Error"
    );
      return;
    
    }else{
      this.taxtrans.amount = (rateFromTax/100) * this.numberFormat;
      this.amount = this.taxtrans.amount;
    }
      

         console.log(this.taxtrans.amount)
  }


  // getpaymentTransaction() {
  
  //   this._opex.getPaymentTransaction()
  //     .subscribe(items => {
  //       this.paytransactionList = items;
       
  
   
  //     });
  // }
      
  save(taxtransactForm: NgForm) {
    this.showMainSpinner();
    this.primengTableHelper.isLoading = true;
    this.saving = true;
    
 
    if (this.taxtrans.id === 0 || this.taxtrans.id == null) {
      
      //this.taxtrans.taxableAmount = this.decimalPipe.transform(this.numberFormat., '1.0-2','en-US');
      this.taxtrans.tenantId = abp.session.tenantId;
      this.taxtrans.paymentId = this.paytransactionId;
      this._opex
        .createTaxTransaction(this.taxtrans)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {

          this.notify.info(this.l('SavedSuccessfully'));
          //this. loadTaxation();
            this.loadTaxTransaction();
          // this.approvalLevel = new CreateApprovalLevelDto();
        });


    } else {
      this._opex
        .updateTaxTransaction(this.taxtrans)
        .subscribe(() => {
         
          this.notify.info('Updated Successfully');
          this.loadTaxTransaction();
          this.saving = false;

        });
      // this.getAuthdesignation();

    }
    this.hideMainSpinner();
    this.primengTableHelper.isLoading = false;
    taxtransactForm.resetForm();

  }
  

  loadTaxTransaction(id?: any) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.taxtransprimengTableHelper.showLoadingIndicator();
    this._opex.getTaxTransaction(this.paytransactionId
    ).pipe(finalize(() => this.taxtransprimengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.taxtransprimengTableHelper.records = result;
      this.taxtransprimengTableHelper.hideLoadingIndicator();
       console.log(result);
       //this.loadApprovalMapping.emit();
    });
  }


  edit(f:CreateTaxTransactionDto): void {

    this.taxtrans.amount = f.amount;
    this.taxtrans.rate = f.rate;
    this.taxtrans.taxableAmount = f.taxableAmount;
    this.taxtrans.taxId = f.taxId;
    this.taxtrans.id=f.id;
  }

  DeleteItem(id: any) {
    this._opex.removeTaxTransaction(id).subscribe(() => {
        this.notify.success("Item remove successfully", "Item Deletion");
        this.loadTaxTransaction(this.paytransactionId);
    });
}



}
