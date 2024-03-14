import { IBasicOrganizationalStructureInfo } from "./IBasicOrganizationalStructureInfo";
import { OrganizationalTreeComponent } from "./organizational-tree.component";
import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    ViewEncapsulation,
    ElementRef,
    EventEmitter,
    Output,
    ChangeDetectorRef,
} from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { OrganizationChartComponent } from "./organization-chart.component";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import {
    CompanyCategoryStructureDto,
    CompanyStructureDto,
    CompanyStructureServiceProxy,
    ListResultDtoOfCompanyStructureDto,
    NewStructureDto,
    Role,
    UpdateCompanyStructureInputDto,
    UserListDto,
    UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { forEach } from "lodash";
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { Table } from 'primeng/table';
import * as XLSX from "xlsx";

import { ModalDirective } from "ngx-bootstrap/modal";
import { ICatEdit, IEdit } from "./create-or-edit-company-modal.component";

@Component({

    templateUrl: "./organizationalstructure.component.html",
    //styleUrls: ['./organization-chart.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class OrganizationalstructureComponent
    extends AppComponentBase
    implements OnInit {
    isSwitchDescription = true;
    switchDescription = "View Organizational Tree";
    @ViewChild("oTree", { static: true }) oTree: OrganizationalTreeComponent;
    @ViewChild("oChart", { static: true }) oChart: OrganizationChartComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('disabledataTable', { static: true }) disabledataTable: Table;

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('organizationUnitDisplayName', { static: true }) organizationUnitDisplayNameInput: ElementRef;
    @ViewChild('organizationUnitCustomCode', { static: true }) organizationUnitCustomCodeInput: ElementRef;
    @ViewChild('organizationUnitUnitTypeId', { static: true }) organizationUnitUnityTypeIdInput: ElementRef;
     @ViewChild('OrganizationUnitHead', { static: true }) OrganizationUnitHeadInput: ElementRef;

    @Output() unitUpdated: EventEmitter<CompanyStructureDto> = new EventEmitter<CompanyStructureDto>();



    active = false;

    organizationUnit: IEdit = {};
    organizationCategory: ICatEdit = {};
    category: CompanyCategoryStructureDto[] = [];
    users: UserListDto[] =[];;
    disable=false;
    placeholderMessage="Enter MIS here";
    oldHeadUser:any;
    orgS: IBasicOrganizationalStructureInfo = null;
    primengTableHelper = new PrimengTableHelper();
    primengTableHelperdisableComp = new PrimengTableHelper();
    companyForm: NgForm;
    structure: { id: number; displayName: string }[] = [];
    dropdownSettings: IDropdownSettings = {};
    roles: Role[] = [];
    CompanyStructureDto: CompanyStructureDto[] = [];
    companydetails = new NewStructureDto();
    companydetail:  NewStructureDto[] = [];
    InitialMisOwner: string;
    InitialMinimumAmount:number;
    InitialMaximumAmount: number;
    saving = false;
    deactivatedId : number;
    fileName= 'DisablecompanyStructure.xlsx';
    fileExpenseRestName = 'ExpenseRestriction.xlsx';
    activateButton = "Activate"
    constructor(
        injector: Injector,
        private _organizationUnitService: CompanyStructureServiceProxy,
        private _changeDetector: ChangeDetectorRef,
        private _user: UserServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //this.primengTableHelper.isLoading = true;
        this.loadallrestrictedunit();
        this.getallunit();
        this.dropdownSettings = {
            singleSelection: false,
            idField: "id",
            textField: "displayName",
            selectAllText: "Select All",
            unSelectAllText: "UnSelect All",
            "enableCheckAll": true,
            itemsShowLimit: 6,
            allowSearchFilter: true,
        };
        this.getDeactivatedCompanyStructure();
    }

    loadallrestrictedunit() {
        this.primengTableHelper.showLoadingIndicator();
        this._organizationUnitService
            .getallOpexrestricted()
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                console.log(result);
                this.primengTableHelper.records = result;
                this.primengTableHelper.hideLoadingIndicator();
                //this.notifier.detectChanges();
            });
    }

    save(){
        if(this.companydetails.id == null){
            this.message.error(this.l("Please select a unit"));
        }
        else{
            this.companydetail.push(this.companydetails);
            this._organizationUnitService
                    .updateOpexrestrictedbyId(this.companydetail)
                    .pipe(
                        finalize(() => {
                            this.saving = false;
                        })
                    )
                    .subscribe(() => {
                        this.notify.info(this.l("Saved Successfully"));
                        this.loadallrestrictedunit();
                        this.companydetails= new NewStructureDto();
                        this.companydetail=[];
                });
            }

    }
    getallunit() {
        var unitId = 4;
        this._organizationUnitService
           .companyStructureList()
            .subscribe((result) => {
                this.CompanyStructureDto = result;
            });
    }
    ouSelected(event: any): void {
        this.orgS = event;

        console.log(this.orgS);
    }

    toggleSwitchDescription() {
        this.switchDescription = "View Organizational Chart";
        this.isSwitchDescription = !this.isSwitchDescription;
        if (this.isSwitchDescription) {
            this.switchDescription = "View Organization Tree";
        }
    }

    disactive(record: CompanyStructureDto){
        //console.log(record);
        this.companydetail =[]
        let i = new NewStructureDto();
        i.id = record.id;
        i.status = "disactive";
        this.companydetail.push(i);
        //console.log(this.companydetail);
        this._organizationUnitService
                .updateOpexrestrictedbyId(this.companydetail)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe(() => {
                    this.notify.info(this.l("Disactive Successfully"));
                    this.loadallrestrictedunit();
                    this.getallunit()
                    this.companydetails= new NewStructureDto();
                    this.companydetail=[];
            });


    }
    selectRoles(event: any) {
        console.log(this.structure);
    }

    onSelectAll(items: any) {
        console.log(items);
    }

    getDeactivatedCompanyStructure(){
        this.showMainSpinner();
        this._organizationUnitService.listOfDeletedCompanyStructure().subscribe((resp)=>{
            this.primengTableHelperdisableComp.records = resp;
            this.hideMainSpinner();

        })

    }

    activateDeactivatedCompanyStructure(Id:number){

        this.showMainSpinner();

        this.saving = true;
        this._organizationUnitService.activateCompanyStructure(Id).subscribe(()=>{
            this.getDeactivatedCompanyStructure();

          this.unitUpdated.emit(null);
          this.refresh();
          this.close();
          this.message.success("Activated Successfully");
            this.saving = false;
            this.hideMainSpinner();


        })
    }
    onShown(): void {
        document.getElementById('OrganizationUnitDisplayName').focus();
        document.getElementById('OrganizationUnitCustomCode').focus();
        //  document.getElementById('OrganizationUnitUnitTypeId').focus();
        //  document.getElementById('OrganizationUnitHead').focus();
    }
    getUsers() {

        this._user.getUserList().subscribe((x) => {
    this.users = x;

        } )
    }
    changeInHead(event){
     console.log(`The value of event is ${event}`);
    }
    showup(Id: number){
        this. deactivatedId = Id;
        this.getUsers();
        this.showMainSpinner();
        this._organizationUnitService.getCompanyStructureBaseOnId(Id).subscribe((res)=>{
                  //  this.companyStructureDto = res;
                    this.organizationUnit.id = res.id;
                    this.organizationUnit.customCode = res.customCode;
                    this.organizationUnit.displayName = res.displayName;
                    this.organizationUnit.headUser = res.headUser;
                    this.organizationUnit.maximumAmount = res.maximumAmount;
                    this.organizationUnit.minimumAmount = res.minimumAmount;
                    this.organizationUnit.parentId = res.parentId;
                    this.organizationUnit.unitTypeId = res.unitTypeId;
                    this.organizationUnit.status = res.status;
                    this.organizationUnit.oldMisHeadUser = res.headUser;
                    this.getCategoryList(res.parentId);

                    this.active = true;
                    this._changeDetector.detectChanges();
                    this.InitialMisOwner = res.headUser;
                    this.InitialMaximumAmount = res.maximumAmount;
                    this.InitialMinimumAmount = res.minimumAmount;

                    console.log(`The value of the company structure UnitType is ${res.unitTypeId}`);

                  //  this.disable=disabled;
                    this.hideMainSpinner();

                    this.modal.show();

        });

    }
    getCategoryList(parentId:any) {
        this._organizationUnitService.getAllCompanyCat(parentId).toPromise().then(x=>{
            this.category=x;

        }).catch(err => {
            this.close();
        })

    }
    changeOnMinimumAmount(event:number){
        console.log(`The value of new minimum amount is ${event}`);
      if(event != this.InitialMinimumAmount){
        this.activateButton = "update and Activate";
      }
    }
    changeOnMaximumAmount(event: number){
        if(event != this.InitialMaximumAmount){
            this.activateButton = "update and Activate";
          }
    }
    GetCustomCode(headUser:any){
        console.log(`The value of head User is ${headUser}`);
        console.log(`The initial HeadUser is ${this.InitialMisOwner}`);
        if(headUser.trim().toLowerCase() != this.InitialMisOwner.trim().toLowerCase()){
          this.activateButton = "update and Activate";
        }

        if(this.organizationUnit.unitTypeId==5){
            console.log(`The organisation Unit Type is ${this.organizationUnit.unitTypeId}`);
            console.log(`The Staff Unit Head is ${headUser}`);
            this._organizationUnitService.staffBaseOnHeadUser(headUser,this.organizationUnit.unitTypeId).subscribe(res=>{
                this.organizationUnit.displayName = res;
            })
            if(this.disable==true){
                if(this.organizationUnit.customCode==null){

                    console.log(`The Second organisation Unit Type is ${this.organizationUnit.unitTypeId}`);
                    this._organizationUnitService.customCode(headUser,this.organizationUnit.unitTypeId).subscribe(x=>{
                        this.organizationUnit.customCode = x;

                        if(x=="" || x==undefined){
                          this.message.warn("Staff code not maintained for this user, kindly enter the staff code below");
                          this.placeholderMessage="Kindly enter staff code here";
                      }
                    })
                }
           }else{
            this._organizationUnitService.customCode(headUser,this.organizationUnit.unitTypeId).subscribe(x=>{
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
    this._organizationUnitService
        .updateCompanyStructure(updateInput)
        .pipe(finalize(() => this.saving = false))
        .subscribe((result: CompanyStructureDto) => {
          //  this.notify.info(this.l('SavedSuccessfully'));
          //  this.close();
             this.refresh();
           this.close();
           this.message.success("Activated Successfully");
         // this.activateDeactivatedCompanyStructure(this.organizationUnit.id);

            result.id = this.organizationUnit.id;
            result.headUser = updateInput.headUser;
            result.minimumAmount = updateInput.minimumAmount;
            result.maximumAmount = updateInput.maximumAmount;
            result.status = updateInput.status;
            this.unitUpdated.emit(result);
        });
}
updateAndActivate(){
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
    this._organizationUnitService
        .activateAndUpdateCompanyStructure(updateInput)
        .pipe(finalize(() => this.saving = false))
        .subscribe(() => {
            this.activateDeactivatedCompanyStructure(this.organizationUnit.id);

        });
}
saveUnit(): void {
this.activateDeactivatedCompanyStructure(this.organizationUnit.id);
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

    refresh(): void {
        window.location.reload();
    }

    exportToExcel(){
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

    exportExpenseRestToExcel(){
        let element = document.getElementById('expenseRest-excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      /* the code here is use to hide the first Column that contain Action from displaying in excel */
    ws['!cols'] = [];
    ws['!cols'][0] = { hidden: true };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileExpenseRestName);
    }
}
