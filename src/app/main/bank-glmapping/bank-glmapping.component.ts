import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import {  BankServiceServiceProxy, BeneficiaryAccountProfileDto, BeneficiaryAccountProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CreateOrEditBankglmapComponent } from './create-or-edit-bankglmap/create-or-edit-bankglmap.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-bank-glmapping',
  templateUrl: './bank-glmapping.component.html',
  styleUrls: ['./bank-glmapping.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class BankGlmappingComponent extends AppComponentBase implements OnInit {

  @ViewChild('createOrEditBankGLMap', { static: true }) createOrEditBankGLMap: CreateOrEditBankglmapComponent;
 // @ViewChild('viewBeneficiaryAccountProfileModalComponent', { static: true }) viewBeneficiaryAccountProfileModal: ViewBeneficiaryAccountProfileModalComponent;

  @ViewChild('paginator', { static: true }) paginator: Paginator;
 @ViewChild('dataTable', { static: true }) dataTable: Table;

 glBankform: NgForm;
  primengTableHelper = new PrimengTableHelper();
  drecords : BeneficiaryAccountProfileDto[] = [];
  fileName= 'GLMappingSetUp.xlsx';

  constructor(
    injector: Injector,
    private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
    private _bankService:  BankServiceServiceProxy,
    private _router: Router ,
   // private _cc: BankPostingTransactionServiceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.primengTableHelper.isLoading = true;
    this.getGLAccount();

    // this._cc.getListOfUnpostedTransactions().subscribe(x => {
    //   console.log(x);
    // });

  }



  getGLAccount(): void {
    this.primengTableHelper.showLoadingIndicator();



    this._beneficiaryAccountProfilesServiceProxy.getBasedOnBeneficiaryType(6).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this._beneficiaryAccountProfilesServiceProxy.getBasedOnBeneficiaryType(5).subscribe(resultx => {
        const newResult = [...resultx, ...result]
        this.primengTableHelper.records = newResult;
        this.primengTableHelper.hideLoadingIndicator();
        console.log(this.primengTableHelper.records)
      });
    });
  }




  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
}


createBankGLMap(): void {
  this.createOrEditBankGLMap.show();
}

  deactivateGlMapping(beneficiaryAccountProfile: BeneficiaryAccountProfileDto): void {
    this.message.confirm(
      this.l('Do you want to delete this mapping?'),
        this.l('Are You Sure'),
        (isConfirmed) => {
            if (isConfirmed) {
                this._beneficiaryAccountProfilesServiceProxy.delete(beneficiaryAccountProfile.id)
                    .subscribe(() => {
                      this.getGLAccount();
                        this.reloadPage();
                        this.notify.success(this.l('Successfully UnMapped'));
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
