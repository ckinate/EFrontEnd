import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { DocumentServiceProxy, FileTypeDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import * as XLSX from "xlsx";

@Component({

  templateUrl: './fileformat.component.html',
  styleUrls: ['./fileformat.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class FileformatComponent  extends AppComponentBase implements OnInit, AfterViewInit {

  fileformatForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

fileformatdto: FileTypeDto = new FileTypeDto();
min: Number = 1;
filetypelist: FileTypeDto[]=[];
fileName= 'fileformat.xlsx';



  saving = false;


  isReady = false;



  constructor(injector: Injector,

    private _docServie: DocumentServiceProxy


    ) {

super(injector);
}


ngOnInit(): void {

  this.loadcurrency();



}

ngAfterViewInit(): void {



}

save(currencyForm: NgForm) {

  if (this.fileformatdto.id === 0 || this.fileformatdto.id ===undefined) {
    this.saving = true;
    //this.currencydto.tenantId = abp.session.tenantId;
    this._docServie
      .createFileType(this.fileformatdto)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(x => {
        if(x != false){
            this.notify.info(this.l('SavedSuccessfully'));
            // this.getAuthdesignation();
             this.loadcurrency() ;
            this.fileformatdto = new FileTypeDto();
        }
        else{
            this.saving = false;
            this.message.error("File Format already exists!");
        }
      });


  } else {
    this._docServie
      .updateFileType(this.fileformatdto)
      .subscribe(() => {
        this.loadcurrency() ;
        this.notify.info('Updated Successfully');
        this.fileformatdto = new FileTypeDto();
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
  this._docServie.getFileTypes(
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;
    this.primengTableHelper.hideLoadingIndicator();
    // this.defaultaccdetails.defaultCode ="";
    // this.defaultaccdetails.accountId ="";
  });
}

edit(f:FileTypeDto): void {

  this.fileformatdto.extensionType = f.extensionType;
  this.fileformatdto.id = f.id;
  this.fileformatdto.tenantId = f.tenantId;
  this.fileformatdto.maxSize = f.maxSize;
}

delete(br:FileTypeDto) {
  this.message.confirm(
      this.l('Delete'),
      this.l('AreYouSure'),
      isConfirmed => {
          if (isConfirmed) {

              this._docServie.deleteFileType(br.extensionType,br.maxSize,br.actionType,br.tenantId,br.companyCode,br.id).subscribe(() => {
                  this.notify.success(this.l('SuccessfullyDeleted'));
                  this.loadcurrency();

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
