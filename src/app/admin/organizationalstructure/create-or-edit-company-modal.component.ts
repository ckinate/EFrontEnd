import { CompanyStructureDto, CompanyStructureServiceProxy, CreateCompanyStructureInputDto, UpdateCompanyStructureInputDto, CompanyCategoryStructureDto, CompanyCategoryStructureInputDto, UserServiceProxy, UserListDto } from './../../../shared/service-proxies/service-proxies';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


export interface IEdit {
    id?: number;
    parentId?: number;
    displayName?: string;
    customCode?: string;
    unitTypeId?: number;
    headUser?: string;
    maximumAmount?:number;
    minimumAmount?:number;
    status?:string;
    oldMisHeadUser?:string;
}
export interface ICatEdit {
    categoryOrder?: number;
    categoryName?: string;
    id?: number;
}
@Component({
    selector: 'createOrEditCompanyModalComponent',
    templateUrl: './create-or-edit-company-modal.component.html'
})
export class CreateOrEditCompanyModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('organizationUnitDisplayName', { static: true }) organizationUnitDisplayNameInput: ElementRef;
    @ViewChild('organizationUnitCustomCode', { static: true }) organizationUnitCustomCodeInput: ElementRef;
    @ViewChild('organizationUnitUnitTypeId', { static: true }) organizationUnitUnityTypeIdInput: ElementRef;
     @ViewChild('OrganizationUnitHead', { static: true }) OrganizationUnitHeadInput: ElementRef;
    @Output() unitCreated: EventEmitter<CompanyStructureDto> = new EventEmitter<CompanyStructureDto>();
    @Output() unitUpdated: EventEmitter<CompanyStructureDto> = new EventEmitter<CompanyStructureDto>();

    active = false;
    saving = false;
    organizationUnit: IEdit = {};
    organizationCategory: ICatEdit = {};
    category: CompanyCategoryStructureDto[] = [];
    users: UserListDto[] =[];;
    disable=false;
    placeholderMessage="Enter MIS here";
    oldHeadUser:any;


    customcode : any;


    constructor(
        injector: Injector,
        private _Service: CompanyStructureServiceProxy,
        private _user: UserServiceProxy,
        private _changeDetector: ChangeDetectorRef
    ) {
        super(injector);
    }

    onShown(): void {
        document.getElementById('OrganizationUnitDisplayName').focus();
        document.getElementById('OrganizationUnitCustomCode').focus();
        //  document.getElementById('OrganizationUnitUnitTypeId').focus();
        //  document.getElementById('OrganizationUnitHead').focus();
    }


    show(organizationUnit: IEdit,disabled:any, changecode: any): void {

     console.log(`The unit Type Id is ${organizationUnit.unitTypeId}`);

        this.getCategoryList(organizationUnit.parentId);
        this.getUsers();
        this.organizationUnit = {};
        this._changeDetector.detectChanges();
        this.organizationUnit = organizationUnit;
        this.active = true;

        this.disable=disabled;

        this.customcode = changecode;



        this.placeholderMessage=this.placeholderMessage;
        console.log(this.organizationUnit);
        console.log("The category is -", this.category);

       // this.GetCustomCode(this.organizationUnit.parentId,this.organizationUnit.id);
        this.modal.show();




    }
    changeOnUnitTypeId(){
        console.log("The Unit Id of the Staff is",this.organizationUnit.unitTypeId);
        console.log(`The Value of the Category Array is ${this.category}`);
    }

    GetCustomCode(headUser:any){

   
        if(this.organizationUnit.unitTypeId==5){
            console.log(`The organisation Unit Type is ${this.organizationUnit.unitTypeId}`);
            console.log(`The Staff Unit Head is ${headUser}`);
            this._Service.staffBaseOnHeadUser(headUser,this.organizationUnit.unitTypeId).subscribe(res=>{
                this.organizationUnit.displayName = res;
            })
            if(this.disable==true){

                if(this.organizationUnit.customCode==null || this.customcode == true){


                    console.log(`The Second organisation Unit Type is ${this.organizationUnit.unitTypeId}`);
                    this._Service.customCode(headUser,this.organizationUnit.unitTypeId).subscribe(x=>{
                        this.organizationUnit.customCode = x;

                        if(x=="" || x==undefined){
                          this.message.warn("Staff code not maintained for this user, kindly enter the staff code below");
                          this.placeholderMessage="Kindly enter staff code here";
                      }
                    })
                }
           }else{
            this._Service.customCode(headUser,this.organizationUnit.unitTypeId).subscribe(x=>{
                this.organizationUnit.customCode = x;
                    console.log(x);
                if(this.organizationUnit.customCode=="" || x==undefined){
                  this.message.warn("Staff code not maintained for this user, kindly enter the staff code below");
                  this.placeholderMessage="Kindly enter staff code here";
              }
            })

        }
        }


    }

    save(): void {
        if (!this.organizationUnit.id) {
            this.createUnit();
        } else {
            this.updateUnit();
        }
    }
getUsers() {

    this._user.getUserList().subscribe((x) => {
this.users = x;

    } )
}

    getCategoryList(parentId:any) {
        this._Service.getAllCompanyCat(parentId).toPromise().then(x=>{
            this.category=x;

        }).catch(err => {
            this.close();
        })
        // ((x) => {
        //     this.category = x;




        // })
        console.log(`The Value of the Category Array is ${this.category}`);
    }


    createCategory() {

        const createInput = new CompanyCategoryStructureInputDto();
        createInput.companyCode = this.getCompanyCode();
        createInput.categoryName = this.organizationCategory.categoryName;
        createInput.id = this.organizationCategory.id;
        createInput.categoryOrder = this.organizationCategory.categoryOrder;
        this._Service.createCompanyCategory(createInput).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.getCategoryList(this.organizationUnit.parentId);
            this.organizationCategory = {};
        });
    }
    updateCategory() {

        const updateInput = new CompanyCategoryStructureInputDto();
        updateInput.categoryName = this.organizationCategory.categoryName;
        updateInput.id = this.organizationCategory.id;
        this._Service.updateCompanyCategory(updateInput).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.getCategoryList(this.organizationUnit.parentId);
        });
    }

    saveCategory(): void {
        if (!this.organizationCategory.id) {
            this.createCategory();
        } else {
            this.updateCategory();
        }

    }

    createUnit() {

        const createInput = new CreateCompanyStructureInputDto();
        createInput.parentId = this.organizationUnit.parentId;
        createInput.displayName = this.organizationUnit.displayName;
        createInput.customCode = this.organizationUnit.customCode;
        createInput.headUser = this.organizationUnit.headUser;
        createInput.unitTypeId = this.organizationUnit.unitTypeId;
        createInput.maximumAmount=this.organizationUnit.maximumAmount;
        createInput.minimumAmount=this.organizationUnit.minimumAmount;
        createInput.status=this.organizationUnit.status;

        this.saving = true;
        this._Service
            .createCompanyStructure(createInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: CompanyStructureDto) => {
                this.notify.info(this.l('SavedvSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }

    updateUnit() {
        const updateInput = new UpdateCompanyStructureInputDto();
        updateInput.id = this.organizationUnit.id;
        updateInput.displayName = this.organizationUnit.displayName;
        updateInput.customCode = this.organizationUnit.customCode;
        updateInput.headUser = this.organizationUnit.headUser;
        updateInput.unitTypeId = this.organizationUnit.unitTypeId;
        updateInput.maximumAmount=this.organizationUnit.maximumAmount;
        updateInput.minimumAmount=this.organizationUnit.minimumAmount;
        updateInput.status=this.organizationUnit.status;
       // updateInput.oldMisHeadUser = this.oldHeadUser;

        this.saving = true;
        this._Service
            .updateCompanyStructure(updateInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: CompanyStructureDto) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                result.id = this.organizationUnit.id;
                result.headUser = updateInput.headUser;
                result.minimumAmount = updateInput.minimumAmount;
                result.maximumAmount = updateInput.maximumAmount;
                result.status = updateInput.status;
                this.unitUpdated.emit(result);
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;

    }


    handleChange(e) {

        if(e.checked==true){
         // this.hidesla = !this.hidesla;
         // this.paytrans.applyPrepayments==e.checked;
         this.organizationUnit.status="Active";

        }else{
            this.organizationUnit.status="InActive";
        }
      }

}
