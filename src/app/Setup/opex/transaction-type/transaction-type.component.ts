import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateTransactionTypeDto, OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { TranstypeModalComponent } from './transtypemodal/transtypemodal.component';
import * as XLSX from "xlsx";

@Component({

  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class TransactionTypeComponent extends AppComponentBase implements OnInit, AfterViewInit {


  saving = false;
  chartOfAcct: ChartOfAccountDto[] = [];
  isEdit:boolean = false

  payTransForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('transModal', {static:true}) transModal:TranstypeModalComponent
  primengTableHelper = new PrimengTableHelper();
  transType:  CreateTransactionTypeDto = new  CreateTransactionTypeDto();
  fileName= 'transactionType.xlsx';

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _opex: OperatingExpenseServiceServiceProxy,

    ) {

super(injector);
}

  ngOnInit(): void {
      this.loadChartofAccount();
      this.loadPaytrans();
  }

  ngAfterViewInit(): void {



  }


  loadChartofAccount(){

    this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
      this.chartOfAcct = r;

    });
  }


  save(taxationForm: NgForm) {
    this.transType.tenantId = abp.session.tenantId;
    if (this.transType.id === 0 || this.transType.id ===undefined) {
      this.saving = true;


      this._opex
        .createTransType(this.transType)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {

          this.notify.info(this.l('SavedSuccessfully'));
         this.loadPaytrans();
         this.transType = new  CreateTransactionTypeDto();
         taxationForm.resetForm();
          // this.approvalLevel = new CreateApprovalLevelDto();
        },error=>{
            this.saving = false;
        });


    } else {

      this._opex
        .updateTransType(this.transType)
        .subscribe(() => {
          this.isEdit = true
          this.notify.info('Updated Successfully');
          this.loadPaytrans();
console.log(this.transType);
          this.transType = new  CreateTransactionTypeDto();

          taxationForm.resetForm();
        }, error=>{

        });
      // this.getAuthdesignation();

    }
    this.isEdit = false;


  }



  loadPaytrans() {

    this.primengTableHelper.showLoadingIndicator();
    this._opex.getTransactionType(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();

    });
  }




  edit(f:CreateTransactionTypeDto): void {

    this.transType.chartOfAccountId = f.chartOfAccountId;
    this.transType.id = f.id;
    this.transType.tenantId = f.tenantId;
    this.transType.narration = f.narration;

  }


  delete(d: CreateTransactionTypeDto): void {
    this.message.confirm(
        this.l('Do you want to deactivate this account?', d.narration),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.deleteTransactionType(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Deactivated'));
                    this.loadPaytrans();
                });
            }
        }
    );
  }
  activate(d: CreateTransactionTypeDto): void {
    this.message.confirm(
        this.l('Do you want to activate this account?', d.narration),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.activateTransactionType(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadPaytrans();
                });
            }
        }
    );
  }

  showEditModal(record: CreateTransactionTypeDto){
    this.transModal.show(record);
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
