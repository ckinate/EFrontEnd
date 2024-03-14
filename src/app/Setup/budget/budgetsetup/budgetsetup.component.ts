import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BudgetLevelDto, BudgetManagerServiceServiceProxy, BudgetPeriodDto, BudgetSetupDto, BudgetThresholdNotificationDto, ChartOfAccountDto, ChartofAccountServiceServiceProxy, CompanyCategoryStructureDto, CompanyStructureServiceProxy, CreateBudgetSetupDto, Role, RoleListDto, RoleServiceProxy, ThresholdRoleDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray,FormControl} from '@angular/forms';
import { BudgetthresholdviewmodalComponent } from './budgetthresholdviewmodal/budgetthresholdviewmodal.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({

templateUrl: './budgetsetup.component.html',
styleUrls: ['./budgetsetup.component.css'],
encapsulation: ViewEncapsulation.None,
animations: [appModuleAnimation()]
})
export class BudgetsetupComponent extends AppComponentBase implements OnInit, AfterViewInit {



saving = false;
chartOfAcct: ChartOfAccountDto[] = [];
// transactionType: TransactionTypeDto[] = [];
records = new BudgetSetupDto();

budgetSetupForm: NgForm;
@ViewChild('dataTable', { static: true }) dataTable: Table;
primengTableHelper = new PrimengTableHelper();
budgetSetup: CreateBudgetSetupDto = new CreateBudgetSetupDto();
acGL: string;
budperiodrecords:BudgetPeriodDto[]=[];
budlevelrecords: BudgetLevelDto[] = [];

orderForm: FormGroup;
items: FormArray;
isEdit:boolean = false

xx:boolean;
emails:{ id: number, displayName: string }[] =[];
thresholdpercent:any;
thresholdcreatelist: BudgetThresholdNotificationDto[] = [];
budgetthresholdlist: BudgetThresholdNotificationDto[] = [];
roles: Role[]=[];


budgetThreshold: BudgetThresholdNotificationDto = new BudgetThresholdNotificationDto();
hidethresholdnotificationform :boolean;
@ViewChild('budgetThresholdViewModal', { static: true }) budgetThresholdViewModal:BudgetthresholdviewmodalComponent;

hidefirstdivcard : boolean;
hideseconddivcard : boolean;
hideupdatebutton:boolean;
hidesavebutton: boolean;
hidethresholdaddbutton:boolean;
hideeditbutton = true;
hidethresholdupdatebutton:boolean;
dropdownSettings : IDropdownSettings = {};
thresholddto: ThresholdRoleDto[]=[];
ccc:{ id: any, displayName: string }[]= [];
companystructurecategory : CompanyCategoryStructureDto[]=[];

switchStyle1 = "white-space: nowrap;background-color: lightgray; padding: 10px; border-radius: 5px; margin: 6px; color: white; box-shadow: 0 0 10px #ccc;";
switchStyle2 = this.switchStyle1;
budgetSetUpMain : BudgetSetupDto;
edittableThreshold: BudgetThresholdNotificationDto;
thresholdblock : boolean;


constructor(injector: Injector,
private _getChartOfAcct: ChartofAccountServiceServiceProxy,
private _bugetservice:BudgetManagerServiceServiceProxy,
private _roleservice:RoleServiceProxy,
private _companystructurecategorey:CompanyStructureServiceProxy



) {

super(injector);
}

ngOnInit(): void {
    this.primengTableHelper.isLoading = true;
this.loadBudgetPeriod();
this.fetchBudgetLevel();
this.loadBudgetSetup();
this.loadBudgetThreshold();
this.getRoles();
this.getcompanycategory();

this.dropdownSettings = {
singleSelection: false,
idField: 'id',
textField: 'displayName',
selectAllText: 'Select All',
unSelectAllText: 'UnSelect All',
itemsShowLimit: 6,
allowSearchFilter: true
}

this.primengTableHelper.isLoading = false;

}

ngAfterViewInit(): void {



}

handleChange(e) {
this.budgetSetup.enforceBudget = e.checked;
this.switchStyle1 = "white-space: nowrap;background-color: lightgray; padding: 10px; border-radius: 5px; margin: 4px; color: white; box-shadow: 0 0 10px #ccc;";
// this.switchStyle2 = "";
}

handleChange1(e) {
  if (!e.checked) {
    this.budgetSetup.budgetThreshold = !e.checked;
    this.hidethresholdnotificationform = false;
    this.hidethresholdaddbutton=false;
    this.hidethresholdupdatebutton=false;
    this.hideseconddivcard = true;
    return
  }
  this.budgetSetup.budgetThreshold = e.checked;
  this.hidethresholdnotificationform = true;
  this.hidethresholdaddbutton=true;
  this.hideseconddivcard = false;
  this.hidethresholdupdatebutton=false;
  this.switchStyle2 = "white-space: nowrap;background-color: lightgray; padding: 10px; border-radius: 5px; margin: 4px; color: white; box-shadow: 0 0 10px #ccc;";

}

ff(mm:any){

}

getcompanycategory(){

    this._companystructurecategorey.getAllCompanyCategory()
    .subscribe(items => {
      this.companystructurecategory = items;
      // console.log(items);
      // console.log(this.mmm);
    });
  }

getRoles(){
this._roleservice.getRoleList().subscribe(result =>{
this.roles = result;

console.log(this.roles);
})

}

selectRoles(event:any){

// console.log(event);
console.log(this.emails);



}

onSelectAll(items: any) {
console.log(items);

}



loadBudgetPeriod(){


this._bugetservice.getbudgetperiod(
).subscribe(result => {

this.budperiodrecords = result;

// this.primengTableHelper.hideLoadingIndicator();
console.log(result);
});
}

changeGender(e) {
console.log(e.target.value);
}

savebudgetthreshold(){


this.thresholdcreatelist = [];

if(this.emails !== undefined){

this.emails.forEach( b =>{
let i = new BudgetThresholdNotificationDto();


i.roleName = b.displayName;
i.roleId=b.id;
i.status = true;
i.budgetSetupId = this.budgetSetUpMain.id;
i.thresholdPercentage=this.thresholdpercent;
i.tenantId = abp.session.tenantId;

this.thresholdcreatelist.push(i);
})


}






this.saving = true;


this._bugetservice
.createBudgetThreshold( this.thresholdcreatelist)
.pipe(
finalize(() => {
this.saving = false;
})
)
.subscribe(() => {


this.notify.info(this.l('SavedSuccessfully'));
this.loadBudgetThreshold();
this.hidethresholdnotificationform = false;
this.thresholdcreatelist = [];
this.emails = null;
this.thresholdpercent = null;
this.hidefirstdivcard = true;
this.hideseconddivcard = false;
//this.hideupdatebutton= false;
this.hidethresholdnotificationform = true;

});


}

updatebudgetthreshold(){

this.thresholdcreatelist = [];

if(this.emails !== undefined){
  console.log(this.emails, this.thresholdpercent,"outstanding");

this.emails.forEach( b =>{
let i = new BudgetThresholdNotificationDto();


i.roleName = b.displayName;
i.roleId=b.id;
i.thresholdPercentage= Number(this.thresholdpercent);
i.tenantId = abp.session.tenantId;
i.id = this.edittableThreshold.id;
i.budgetSetupId = this.budgetSetUpMain.id;

//console.log(i, "Set threshold")

this.thresholdcreatelist.push(i);
})


}

this.saving = true;

//console.log(this.thresholdcreatelist)

this._bugetservice
.updateBudgetThreshold( this.thresholdcreatelist)
.subscribe(() => {

this.notify.info('Updated Successfully');
//this. loadBudgetSetup();
this.loadBudgetThreshold();
this.thresholdcreatelist = [];
this.emails = null;
this.thresholdpercent= null;
this.hidefirstdivcard = true;
this.hideseconddivcard = false;
this.hidethresholdaddbutton=false;
this.hidethresholdupdatebutton=false;
this.hidethresholdaddbutton = true;

});


}


save(budgetSetupForm? : NgForm){



if ( this.budgetSetup.id === 0 || this.budgetSetup.id === undefined) {
this.saving = true;

this._bugetservice
.createBudgetSetup(this.budgetSetup)
.pipe(
finalize(() => {
this.saving = false;
})
)
.subscribe(() => {


this.notify.info(this.l('SavedSuccessfully'));
this. loadBudgetSetup();
this.hidethresholdnotificationform = false;
this.budgetSetup= new CreateBudgetSetupDto();

this.emails = null;
this.thresholdpercent = null;
this.hidefirstdivcard = false;
// this.hideseconddivcard = true;
this.hideupdatebutton= false;

});



} else {
this._bugetservice
.updateBudgetSetup( this.budgetSetup)
.subscribe(() => {

    this.isEdit = true;
this.notify.info('Updated Successfully');
this. loadBudgetSetup();
this.budgetSetup= new CreateBudgetSetupDto();
this.emails = null;
this.thresholdpercent= null;
});


}
this.isEdit = false;
//budgetSetupForm.resetForm();

}




update(budgetSetupForm? : NgForm){



this.thresholdblock = !this.thresholdblock;
this.saving = true;
this.hideupdatebutton = true;

this._bugetservice
.updateBudgetSetup( this.budgetSetup)
.subscribe(() => {
 this.isEdit = true;
this.notify.info('Updated Successfully');
this. loadBudgetSetup();
this.budgetSetup= new CreateBudgetSetupDto();
this.emails = null;
this.thresholdpercent= null;
this.hidefirstdivcard = false;
this.hideseconddivcard = true;
this.hideupdatebutton = false;
this.hideeditbutton = true;
this.handleChange1(false);
});


this.isEdit = false;
//budgetSetupForm.resetForm();

}

loadBudgetThreshold(){



this.primengTableHelper.showLoadingIndicator();
this._bugetservice.getBudgetThreshold(
).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

this.primengTableHelper.records = result;
this.primengTableHelper.hideLoadingIndicator();
console.log(result);
});
}



loadBudgetSetup(){


this._bugetservice.getBudgetSetup(
).subscribe(result => {

this.records = result;


if(this.records.id ===undefined){


this.hidefirstdivcard = true;
this.hideseconddivcard = false;
this.hidesavebutton = true;


}else{
this.hidefirstdivcard = false;
this.hideseconddivcard = true;
this.hidesavebutton=false;

}
console.log(result);
  this.budgetSetUpMain = result;
});
}


edit(f:BudgetSetupDto): void {

this.hidefirstdivcard = true;
this.thresholdblock = !this.thresholdblock;
this.hideseconddivcard = false;
this.hideupdatebutton= true;
this.hidesavebutton=false;
this.hideeditbutton = false;

this.budgetSetup.budgetPeriodId = f.budgetPeriodId;

this.budgetSetup.id = f.id;
this.budgetSetup.budGetLevel=f.budGetLevel;
this.budgetSetup.enforceBudget= f.enforceBudget;

this.budgetSetup.budgetThreshold=f.budgetThreshold;
this.budgetSetup.budGetLevelId=f.budGetLevelId;
this.budgetSetup.companyCategoryStructureId=f.companyCategoryStructureId;


if(this.budgetSetup.budgetThreshold ==true){
this.hidethresholdnotificationform = true;
this.hidethresholdaddbutton=true;
this.hidethresholdupdatebutton=false;
}else{
this.hidethresholdnotificationform = false;
this.hidethresholdaddbutton=true;
this.hidethresholdupdatebutton=false;
}




}



editbudgetthreshold(f:BudgetThresholdNotificationDto): void {
  console.log(f);

  this.edittableThreshold = f;

this.hidethresholdaddbutton=false;
this.hidethresholdupdatebutton=true;
//let str2 = f.roleName.replace(/\,/g,"");

this.emails = this.primengTableHelper.records;
this._bugetservice.getthresholdroleid(f.thresholdPercentage).subscribe(result =>{
this.thresholddto = result
this.ccc = [];
this.thresholddto.forEach(v =>{


this.ccc.push({id:v.roleId,displayName:v.roleName});

})


this.emails = this.ccc;

})

this.budgetThreshold.id = f.id;
this.thresholdpercent=f.thresholdPercentage;






}

delete(accmap: BudgetThresholdNotificationDto): void {
  console.log(accmap, "accc");

this.message.confirm(
this.l('Do you want to delete this record?'),
this.l('AreYouSure'),
isConfirmed => {
if (isConfirmed) {
this._bugetservice.deleteBudgetSetup(accmap.id,accmap.thresholdPercentage).subscribe(() => {
// this.reloadPage();
this. loadBudgetSetup();
this.loadBudgetThreshold();
this.message.info(this.l('Successfully Deactivated'));
 this.hideupdatebutton=false;
});
}
}

);

}
activate(accmap: BudgetThresholdNotificationDto): void {

    this.message.confirm(
    this.l('Do you want to activate this record?'),
    this.l('Are You Sure'),
    isConfirmed => {
    if (isConfirmed) {
    this._bugetservice.activateBudgetSetup(accmap.id,accmap.thresholdPercentage).subscribe(() => {
    // this.reloadPage();
    this. loadBudgetSetup();
    this.loadBudgetThreshold();
    this.message.info(this.l('Successfully Activated'));
     this.hideupdatebutton=false;
    });
    }
    }

    );

    }

fetchBudgetLevel(){


this._bugetservice.getBudgetLevel(
).subscribe(result => {

this. budlevelrecords = result;

console.log(result);
});
}


add(id?: any) {
//let id = 0;

this.budgetThresholdViewModal.show(id);



}



}
