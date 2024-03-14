import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { Currency, CurrencyDto, CurrencyExchangeRateDto, DefaultCurrencyDto, GeneralOperationsServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-defaultcurrency',
  templateUrl: './defaultcurrency.component.html',
  styleUrls: ['./defaultcurrency.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class DefaultcurrencyComponent extends AppComponentBase implements OnInit, AfterViewInit {

  defaultCurrencyForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

defautcurrencydto: DefaultCurrencyDto = new DefaultCurrencyDto();

record:DefaultCurrencyDto = new DefaultCurrencyDto();

 currencyExchangeRateForm: NgForm;
currencyExchangeRatelist: CurrencyExchangeRateDto[]=[];
createExchangeRatelist:CurrencyExchangeRateDto=new CurrencyExchangeRateDto();
getCurrencyExceptDefault:CurrencyDto[]=[];
  saving = false;
  fileName= 'Defaultcurrency.xlsx';


  isReady = false;
  isEdit:boolean = false

  currencyList: CurrencyDto[] =[];

  constructor(injector: Injector,

    private _currencyServie: GeneralOperationsServiceServiceProxy


    ) {

super(injector);
}


ngOnInit(): void {

  this.getCurrencyList();
  this.loadDefault();
  this.loadcurrencyExceptDefault() ;
  this.loadcurrencyExchangeRate();

}

ngAfterViewInit(): void {



}


getCurrencyList() {
  this._currencyServie.getCurrencyList().subscribe((x) => {
this.currencyList = x;
  });
}
save(defaultCurrencyForm: NgForm) {
   debugger;
   console.log(this.defautcurrencydto.id)
  if (this.defautcurrencydto.id === 0 || this.defautcurrencydto.id ===undefined) {
    this.saving = true;
    this.defautcurrencydto.tenantId = abp.session.tenantId;

    this._currencyServie
      .createDefaultCurrency(this.defautcurrencydto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));
        // this.getAuthdesignation();
         this.loadDefault() ;
         this.loadcurrencyExceptDefault() ;
         this.defautcurrencydto = new DefaultCurrencyDto();
      });


  } else {
    this._currencyServie
     .updateDefaultCurrency(this.defautcurrencydto )
      .subscribe(() => {
        this.isEdit = true;
        this.loadDefault() ;
        this.notify.info('Updated Successfully');
        this.defautcurrencydto = new DefaultCurrencyDto();
        this.loadcurrencyExceptDefault() ;
      });
    // this.getAuthdesignation();

  }
  this.isEdit = false;
  defaultCurrencyForm.resetForm();

}

loadDefault() {
  // if (this.primengTableHelper.shouldResetPaging(event)) {
  //     this.paginator.changePage(0);

  //     return;
  // }
  this.primengTableHelper.showLoadingIndicator();
  this._currencyServie.getDefaultCurrency(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.record = result;
    this.primengTableHelper.hideLoadingIndicator();
    this.defautcurrencydto.currencyId=this.record.currencyId;


  });
}

edit(f:DefaultCurrencyDto): void {

  this.defautcurrencydto.currencyCode = f.currencyCode;
  this.defautcurrencydto.id = f.id;

 // this.defautcurrencydto.currencyName = f.currencyName;
}

loadcurrencyExceptDefault() {


  this.primengTableHelper.showLoadingIndicator();
  this._currencyServie.getCurrencyExceptDefault(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.getCurrencyExceptDefault = result;
    //console.log(this.getCurrencyExceptDefault);
    this.primengTableHelper.hideLoadingIndicator();


  });
}





saveExchangeRate(currencyExchangeRateForm: NgForm) {

  console.log(this.createExchangeRatelist.id)
  if (this.createExchangeRatelist.id === 0 || this.createExchangeRatelist.id == null) {
    this.saving = true;
    this.createExchangeRatelist.tenantId = abp.session.tenantId;
    this.createExchangeRatelist.defaultCurrencyCode = this.record.currencyCode;
    this.createExchangeRatelist.active='Active';
    this._currencyServie
      .createCurrencyExchangeRate(this.createExchangeRatelist)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));


         this.loadcurrencyExchangeRate()
         this.defautcurrencydto = new DefaultCurrencyDto();

      });


  } else {
    this._currencyServie
    .updateCurrencyExchangeRate(this.createExchangeRatelist )
      .subscribe(() => {
        this.loadcurrencyExchangeRate() ;
        this.notify.info('Updated Successfully');
        this.defautcurrencydto = new DefaultCurrencyDto();
      });


  }
  currencyExchangeRateForm.resetForm();

}

loadcurrencyExchangeRate() {

  this.primengTableHelper.showLoadingIndicator();
  this._currencyServie.getCurrencyExchangeRateList(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.currencyExchangeRatelist = result;
    console.log(this.currencyExchangeRatelist)
    this.primengTableHelper.hideLoadingIndicator();

  });
}

editCurrencyExchangeRate(f:CurrencyExchangeRateDto): void {

  this.createExchangeRatelist.defaultCurrencyCode= f.defaultCurrencyCode;
  this.createExchangeRatelist.exchangeCurrencyCode= f.exchangeCurrencyCode;
  this.createExchangeRatelist.exchangeRate= f.exchangeRate;
  this.defautcurrencydto.id = f.id;
  this.createExchangeRatelist.id=f.id;


}
activateCurrencyExchangeRate(br:CurrencyExchangeRateDto) {
  this.message.confirm(
      this.l('Do you want to activate this account?'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {
              this._currencyServie.activateCurrencyExchangeRate(br.id).subscribe(() => {
                  this.notify.success(this.l('Successfully '));
                  this.loadcurrencyExchangeRate();

              });
          }
      }
  );

}
deactivateCurrencyExchangeRate(br:CurrencyExchangeRateDto) {
  this.message.confirm(
      this.l('Do you want to deactivate this account?'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {
              this._currencyServie.deactivateCurrencyExchangeRate(br.id).subscribe(() => {
                  this.notify.success(this.l('Successfully deactivated'));
                  this.loadcurrencyExchangeRate();

              });
          }
      }
  );

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
