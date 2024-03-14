import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { UsersCategoryDto, UsersCategoryServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'userCategorysModal',
  templateUrl: './usercategorysmodal.component.html',
  styleUrls: ['./usercategorysmodal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class UsercategorysmodalComponent extends AppComponentBase implements OnInit, AfterViewInit{
  saving = false;

 

  userCategoryForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("modal", { static: true }) modal: ModalDirective;
   primengTableHelper = new PrimengTableHelper();
   usercategory:  UsersCategoryDto = new UsersCategoryDto();
   active = false;
  constructor(injector: Injector,
    private _getUserCategory: UsersCategoryServiceServiceProxy,
    // private _opex: OperatingExpenseServiceServiceProxy,
   
    ) {

super(injector);
}

  ngOnInit(): void {
    
   }

  ngAfterViewInit(): void {



  }

  save(userCategoryForm: NgForm) {
  
    if (this.usercategory.id === 0 || this.usercategory.id ===undefined) {
      this.saving = true;
      
      //this.taxation.tenantId = abp.session.tenantId;
      this._getUserCategory.createUserCategory(this.usercategory)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.message.info("User Category successfully");
          this.notify.info(this.l('SavedSuccessfully'));
          this. loadUserCategory();
          this.usercategory = new UsersCategoryDto();
          this.refresh();
        });


    } else {
      this._getUserCategory
        .editUserCat(this.usercategory)
        .subscribe(() => {
         
          this.notify.info('Updated Successfully');
        this. loadUserCategory();
         this.usercategory = new UsersCategoryDto();
         this.refresh();
        });
      // this.getAuthdesignation();

    }
    userCategoryForm.resetForm();

  }
  
  loadUserCategory() {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.primengTableHelper.showLoadingIndicator();
    this._getUserCategory.getUserCatList(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
  }
  
  
  show(result: UsersCategoryDto): void {
    this.active = true;
    this.edit(result);

   
    this.usercategory.categoryId = result.categoryId;
    this.usercategory.id = result.id;
    //this.usercategory.tenantId = result.tenantId;
    this.usercategory.description = result.description;
    this.usercategory.status = result.status;
    
    console.log(result);

    this.modal.show();
}

edit(f:UsersCategoryDto): void {

  this.usercategory.categoryId = f.categoryId;
  this.usercategory.id = f.id;
  //this.taxation.tenantId = f.tenantId;
  this.usercategory.description = f.description;
  this.usercategory.status = f.status;
  // this.usercategory.witholding = f.witholding;
}  

// deactivate(d: UsersCategoryDto): void {
//   this.message.confirm(
//       this.l('Do you want to deactivate this category of user?', d.description),
//       this.l('AreYouSure'),
//       isConfirmed => {
//           if (isConfirmed) {
//               this._getUserCategory.(d.id).subscribe(() => {
//                  // this.reloadPage();
//                   this.notify.success(this.l('SuccessfullyDeleted'));
//                   this.loadTaxation();
//               });
//           }
//       }
//   );
// }

// activate(d: UsersCategoryDto): void {
//   this.message.confirm(
//       this.l('Do you want to activate this User Category?', d.description),
//       this.l('Are You Sure'),
//       isConfirmed => {
//           if (isConfirmed) {
//               this._getUserCategory.getActiveUserCat(d.id).subscribe(() => {
//                  // this.reloadPage();
//                   this.notify.success(this.l('Successfully Activated'));
//                   this.loadTaxation();
//               });
//           }
//       }
//   );
// }


  close(): void {
    this.modal.hide();
    this.active = false;
}
onShown(): void {}

refresh(): void {
  window.location.reload();
}

}