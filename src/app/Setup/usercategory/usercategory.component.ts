import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { UsersCategoryDto, UsersCategoryServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { UsercategorysmodalComponent } from './usercategorysmodal/usercategorysmodal.component';
import * as XLSX from "xlsx";


@Component({
  templateUrl: './usercategory.component.html',
  styleUrls: ['./usercategory.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class UsercategoryComponent extends AppComponentBase implements OnInit, AfterViewInit {

  saving = false;
  //chartOfAcct: ChartOfAccountDto[] = [];
  isEdit:boolean = false;

  userCategoryForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('userCategorysModal', {static:true}) userCategorysModal:UsercategorysmodalComponent;
  primengTableHelper = new PrimengTableHelper();
  usercategory:  UsersCategoryDto = new UsersCategoryDto();
  fileName= 'UserCategorySetUp.xlsx';

  constructor(injector: Injector,
    private _getUserCategory: UsersCategoryServiceServiceProxy,

  ) {
    super(injector);
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.loadUserCategory();
  }
  add(record : UsersCategoryDto){
   this.userCategorysModal.show(record);
  }

  save(userCategoryForm: NgForm) {

    if (this.usercategory.id === 0 || this.usercategory.id ===undefined) {
      this.saving = true;
      this.usercategory.id = abp.session.tenantId;
      this._getUserCategory
        .createUserCategory(this.usercategory)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.message.info("User Category successfully sent for appoval");
          this.notify.info(this.l('SavedSuccessfully'));
          this.loadUserCategory();
          this.usercategory = new UsersCategoryDto();

        });


    } else {
      this._getUserCategory
        .editUserCat(this.usercategory)
        .subscribe(() => {
        this.isEdit = true;

          this.notify.info('Updated Successfully');
        this. loadUserCategory();
         this.usercategory = new UsersCategoryDto();

        });
      // this.getAuthdesignation();

    }
    this.isEdit = false;
    userCategoryForm.resetForm();

  }

  loadUserCategory() {

    this.primengTableHelper.showLoadingIndicator();
    this._getUserCategory.getUserCatList(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {


      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();

    });
  }

  edit(f:UsersCategoryDto): void {

    this.usercategory.categoryId = f.categoryId;
    this.usercategory.id = f.id;
    this.usercategory.description = f.description;
    this.usercategory.status = f.status;
  }

  activate(d: UsersCategoryDto, s: boolean): void {


    let actionType = 'deactivate';
    let actionTypeDone = 'deactivated';
    if(s){
      actionType = 'activate';
      actionTypeDone = 'activated';
    }

    this.message.confirm(
        this.l('Do you want to '+ actionType +' this Category of User?', d.description),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
d.status = s;

                this._getUserCategory.editUserCat(d).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success('Successfully ' + actionTypeDone);
                    this.loadUserCategory();
                });
            }
        }
    );
  }

  delete(d: UsersCategoryDto): void {
    this.message.confirm(
        this.l('Do you want to delete this category?', d.description),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._getUserCategory.deleteUserCategory(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.loadUserCategory();
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
