import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, DefaultAccount, DefaultAccountDetailsDto, DefaultAccountDetailsServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { DefaultaccModalComponent } from './defaultaccmodal/defaultaccmodal.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-default-account-details',
  templateUrl: './default-account-details.component.html',
  styleUrls: ['./default-account-details.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class DefaultAccountDetailsComponent extends AppComponentBase implements OnInit, AfterViewInit {

  defaultaccForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('defaultaccModal', {static:true}) defaultaccModal:DefaultaccModalComponent
  primengTableHelper = new PrimengTableHelper();

 defaultaccdetails:  DefaultAccountDetailsDto = new DefaultAccountDetailsDto();

 defaultcode: DefaultAccount[] = [];
  // operationList: OperationsDto[] = [];
   //transactionTypeList: TransactionTypeDto[] = [];


  chartOfAcct: ChartOfAccountDto[] = [];
  isEdit:boolean = false;
  fileName= 'DefaultAccountDetail.xlsx';


  saving = false;


  isReady = false;



  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _defaultaccService: DefaultAccountDetailsServiceServiceProxy


    ) {

super(injector);
}


ngOnInit(): void {





}

ngAfterViewInit(): void {

  this.loadDefaultAcc();
  this.loadChartofAccount();
  this.loadDefaultCode();

}

 loadDefaultCode(){
    this._defaultaccService.getListDefaultAcc().subscribe(result => {
       this.defaultcode = result;
    })
 }


loadChartofAccount(){

  this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
    this.chartOfAcct = r;


  });
}


save(defaultaccForm: NgForm) {

  if (this.defaultaccdetails.id === 0 || this.defaultaccdetails.id == null) {
    this.saving = true;
    this.defaultaccdetails.tenantId = abp.session.tenantId;
    this._defaultaccService
      .createDefaultAccDetails(this.defaultaccdetails)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {

        this.notify.info(this.l('SavedSuccessfully'));
        // this.getAuthdesignation();
         this.loadDefaultAcc() ;
        this.defaultaccdetails = new DefaultAccountDetailsDto();
      });


  } else {
    this._defaultaccService
      .updateDefaultAccDetails(this.defaultaccdetails)
      .subscribe(() => {
          this.isEdit = true;
        this.loadDefaultAcc() ;
        this.notify.info('Updated Successfully');
        this.defaultaccdetails = new DefaultAccountDetailsDto();
      });
    // this.getAuthdesignation();

  }
  defaultaccForm.resetForm();

}

loadDefaultAcc() {
  // if (this.primengTableHelper.shouldResetPaging(event)) {
  //     this.paginator.changePage(0);

  //     return;
  // }
  this.primengTableHelper.showLoadingIndicator();
  this._defaultaccService.getDefaultAccDetails(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;
    this.primengTableHelper.hideLoadingIndicator();
    this.defaultaccdetails.defaultCode ="";
    this.defaultaccdetails.accountId ="";
  });
}

edit(f:DefaultAccountDetailsDto): void {

  this.defaultaccdetails.defaultCode = f.defaultCode;
  this.defaultaccdetails.id = f.id;
  this.defaultaccdetails.tenantId = f.tenantId;
  this.defaultaccdetails.accountId = f.accountId;
//   this.defaultaccdetails.userName = f.userName;
//   this.defaultaccdetails.creationTime = f.creationTime;
 this.isEdit = true;
}

delete(br:DefaultAccountDetailsDto) {
  this.message.confirm(
      this.l('Deactivate'),
      this.l('AreYouSure'),
      isConfirmed => {
          if (isConfirmed) {
              this._defaultaccService.deleteDefaultAccDetailS(br.id).subscribe(() => {
                  this.notify.success(this.l('Successfully Deactivated'));
                  this.loadDefaultAcc();

              });
          }
      }
  );

}
activate(br:DefaultAccountDetailsDto) {
  this.message.confirm(
      this.l('Do you want to activate this account?'),
      this.l('Are You Sure'),
      isConfirmed => {
          if (isConfirmed) {
              this._defaultaccService.activateDefaultAccDetailS(br.id).subscribe(() => {
                  this.notify.success(this.l('Successfully Activated'));
                  this.loadDefaultAcc();

              });
          }
      }
  );

}
showEditModal(record: DefaultAccountDetailsDto){
  this.defaultaccModal.show(record);
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
