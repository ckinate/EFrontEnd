import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng';
import * as XLSX from "xlsx";

@Component({
  selector: 'view-deleted-user',
  templateUrl: './view-deleted-user.component.html',
  styleUrls: ['./view-deleted-user.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ViewDeletedUserComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, private _userServiceProxy: UserServiceProxy) {
    super(injector)
   }

   @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
   @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
   userList: UserListDto[] = [];
   saving : boolean = false;
   fileName= 'DisableUsers.xlsx';

   @ViewChild('dataTable', { static: true }) dataTable: Table;
   primengTableHelper = new PrimengTableHelper();

  ngOnInit() {
    this.getAllDeletedUser();
  }
 getAllDeletedUser(){
   this.showMainSpinner();
   this._userServiceProxy.listOfDeletedUser().subscribe(res =>{
      this.userList = res;
      this.hideMainSpinner();
   })
 }
 show(){
   this.modal.show();
 }
 activateDeletedUser(Id:number){
  this.message.confirm(
    this.l('You want to Activate the User'),
    this.l('AreYouSure'),
    (isConfirmed) => {
        if (isConfirmed) {
            this._userServiceProxy.activateDeletedUser(Id)
                .subscribe(() => {

                    this.notify.success(this.l('Successfully Activated'));
                    this.modalSave.emit(null);
                    this.close();
                });
        }
    }
);
 }

 close(): void {

  this.modal.hide();
}

onShown(): void {
  this.getAllDeletedUser();

}
exportToExcel(){

    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    ws['!cols'] = [];
    ws['!cols'][0] = { hidden: true };
    /* here 0 is your column number (n-1) */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
}

}
