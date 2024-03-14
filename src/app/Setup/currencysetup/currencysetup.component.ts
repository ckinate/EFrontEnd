import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CurrencyDto, GeneralOperationsServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CurrencyModalComponent } from './currencymodal/currencymodal.component';
import * as XLSX from "xlsx";

@Component({

  templateUrl: './currencysetup.component.html',
  styleUrls: ['./currencysetup.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CurrencysetupComponent extends AppComponentBase implements OnInit, AfterViewInit {

  currencyForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('currencyModal', {static:true}) currencyModal:CurrencyModalComponent
  primengTableHelper = new PrimengTableHelper();

currencydto: CurrencyDto = new CurrencyDto();

currencylist: CurrencyDto[]=[];
fileName= 'CurrencySetUp.xlsx';



  saving = false;


  isReady = false;



  constructor(injector: Injector,

    private _currencyServie: GeneralOperationsServiceServiceProxy


    ) {

super(injector);
}


ngOnInit(): void {

  this.loadcurrency();



}

ngAfterViewInit(): void {



}

save(currencyForm: NgForm) {

  if (this.currencydto.id === 0 || this.currencydto.id ===undefined) {
    this.saving = true;
    //this.currencydto.tenantId = abp.session.tenantId;
    this._currencyServie
      .createCurrency(this.currencydto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));
        // this.getAuthdesignation();
         this.loadcurrency() ;
        this.currencydto = new CurrencyDto();
      });


  } else {
    this._currencyServie
      .updateCurrency(this.currencydto)
      .subscribe(() => {
        this.loadcurrency() ;
        this.notify.info('Updated Successfully');
        this.currencydto = new CurrencyDto();
      });
    // this.getAuthdesignation();

  }
  currencyForm.resetForm();

}

loadcurrency() {
  // if (this.primengTableHelper.shouldResetPaging(event)) {
  //     this.paginator.changePage(0);

  //     return;
  // }
  this.primengTableHelper.showLoadingIndicator();
  this._currencyServie.getCurrencyList(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;
    this.primengTableHelper.hideLoadingIndicator();
    // this.defaultaccdetails.defaultCode ="";
    // this.defaultaccdetails.accountId ="";
  });
}

edit(f:CurrencyDto): void {

  this.currencydto.currencyCode = f.currencyCode;
  this.currencydto.id = f.id;
  //this.currencydto.tenantId = f.tenantId;
  this.currencydto.currencyName = f.currencyName;
}

delete(br:CurrencyDto) {
  this.message.confirm(
      this.l('Delete'),
      this.l('AreYouSure'),
      isConfirmed => {
          if (isConfirmed) {

              this._currencyServie.deletecurrency(br.currencyCode,br.currencyName,br.active,br.id).subscribe(() => {
                  this.notify.success('Successfully Deactivated');
                  this.loadcurrency();

              });
          }
      }
  );

}

activate(br:CurrencyDto) {
  this.message.confirm(
      this.l('Activate'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {

              this._currencyServie.activateCurrency(br).subscribe(() => {
                  this.notify.success(this.l('Successfully Activated'));
                  this.loadcurrency();

              });
          }
      }
  );

}

showEditModal(record: CurrencyDto){
  this.currencyModal.show(record);
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
