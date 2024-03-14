import { AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { GeneralOperationsServiceServiceProxy, OperationsDto, TransRefSettingDto } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import * as XLSX from "xlsx";

@Component({
  selector: 'refnosetup',
  templateUrl: './refnosetup.component.html',
  styleUrls: ['./refnosetup.component.css']
})
export class RefnosetupComponent extends AppComponentBase implements OnInit, AfterViewInit{

  refForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  @ViewChild('paginator', { static: true }) paginator: Paginator;


  operationList: OperationsDto[] = [];
  saving = false;

 createRefSetting: TransRefSettingDto = new TransRefSettingDto();
 RefSettingList: TransRefSettingDto[] = [];
 fileName= 'refNoSetUp.xlsx';

  constructor(injector: Injector,

     private _operationService: GeneralOperationsServiceServiceProxy
    ) {

super(injector);
}

ngOnInit(): void {
  this.getOperation();
  this.loadRefSetting();

}
ngAfterViewInit(): void {

}

getOperation() {

  this._operationService.getListOperation()
    .subscribe(items => {
      this.operationList = items;



    });
}


save(refForm: NgForm) {

  if (this.createRefSetting.id === 0 || this.createRefSetting.id ===undefined) {
    this.saving = true;
    this.createRefSetting.tenantId = abp.session.tenantId;
    this._operationService
      .createRefByOperation(this.createRefSetting)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.message.info("Taxation successfully sent for appoval");
        this.notify.info(this.l('SavedSuccessfully'));
        this. loadRefSetting();
        this.createRefSetting = new TransRefSettingDto();

      });


  } else {
    this._operationService
      .updateRefSetting(this.createRefSetting )
      .subscribe(() => {
     // this.isEdit = true;

        this.notify.info('Updated Successfully');
      this. loadRefSetting();
       this.createRefSetting  = new TransRefSettingDto();

      });
    // this.getAuthdesignation();

  }
  //his.isEdit = false;
  refForm.resetForm();

}



loadRefSetting() {

  this.primengTableHelper.showLoadingIndicator();
  this._operationService.transRefSettingList(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
console.log(result);
    this.primengTableHelper.records = result;
    this.primengTableHelper.hideLoadingIndicator();

    console.log(result)

  });
}


Edit(f:TransRefSettingDto){

  this.createRefSetting.operationId=f.operationId;
  this.createRefSetting.norm_Acroyno=f.norm_Acroyno;
  this.createRefSetting.lenCount=f.lenCount;
  this.createRefSetting.id=f.id;

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
