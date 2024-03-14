import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BankServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash';
import { Paginator } from 'primeng';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateAndEditComponent } from './create-and-edit/create-and-edit.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-bank-setup',
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class BankSetupComponent extends AppComponentBase implements OnInit {

  @ViewChild('bankCreateAndEdit', { static: true }) bankCreateAndEdit: CreateAndEditComponent;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;


  bankform: NgForm;
  primengTableHelper = new PrimengTableHelper();

  saving = false;
  isReady = false;
  fileName= 'BankSetUp.xlsx';

  constructor(
    injector: Injector,
    private _bankService:  BankServiceServiceProxy,
    private _router: Router
  )
  {
    super(injector);
  }

  ngOnInit(): void {
    this.primengTableHelper.isLoading = true;
    this.loadBanks();
  }


  loadBanks()
  {
    this.primengTableHelper.showLoadingIndicator();
    this._bankService.getBankList().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result =>
      {
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }


  createOrEditBank(): void {
    this.bankCreateAndEdit.show();
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
