import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, OrganizationUnitDto, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserRoleDto, UserServiceProxy, GetUserForEditOutput, CompanyCategoryStructureDto, CompanyStructureDto, BankServiceServiceProxy, BankDto, CompanyStructureServiceProxy, UserListDto, CreateOrEditBeneficiaryAccountProfileDto, BeneficiaryAccountProfileDto, BeneficiaryAccountProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOrganizationUnitsTreeComponentData, OrganizationUnitsTreeComponent } from '../shared/organization-unit-tree.component';
import { map as _map, filter as _filter, result } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styleUrls: ['create-or-edit-user-modal.component.less']
})
export class CreateOrEditUserModalComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('organizationUnitTree') organizationUnitTree: OrganizationUnitsTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    UserInfoSave: NgForm;
    active = false;
    saving = false;
    canChangeUserName = true;
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;

    allOrganizationUnits: OrganizationUnitDto[];
    memberedOrganizationUnits: string[];
    userPasswordRepeat = '';

    categoryList: CompanyCategoryStructureDto[] = [];
    compCat : CompanyCategoryStructureDto = new CompanyCategoryStructureDto();
    listCompanyStructure: CompanyStructureDto[] = [];
    CompanyStructuredto: CompanyStructureDto= new CompanyStructureDto;
    CompanyStructureStaffMisdto: CompanyStructureDto[] = [];
    custCodeList : CompanyStructureDto[] = [];
    Banks : BankDto[] = [];
    userBankProfile : CreateOrEditBeneficiaryAccountProfileDto = new CreateOrEditBeneficiaryAccountProfileDto();
    userBank : BeneficiaryAccountProfileDto = new BeneficiaryAccountProfileDto();
    selectedBank : string =null;
    customCodeList : CompanyStructureDto[] = [];
    CategoryId : any;
    usersList : UserListDto[];
    checkforUserName:any;
    checkforUserId: any;
    hidePasswordReset: boolean = true;

    RoleName: any;


    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _bankService:  BankServiceServiceProxy,
        private _companyStructureService : CompanyStructureServiceProxy,
        private _beneficiaryService : BeneficiaryAccountProfilesServiceProxy,
    ) {
        super(injector);
    }


    ngOnInit(): void {

        this.getAllUsers()
    }

    show(userId?: number): void {



        if (!userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
            this.userBankProfile.beneficiaryAccountNumber = null;
            this.userBankProfile.beneficiaryName = null;
            this.userBankProfile.bankCode = null;
        }

        this._userService.getUserForEdit(userId).subscribe(userResult => {
            this.user = userResult.user;
             this.checkforUserName = this.user.userName;
             this.checkforUserId = this.user.staffId;
            this.roles = userResult.roles;
            this.RoleName ='';
let hasValue =  userResult.roles.filter(x => x.isAssigned==true);

            if (hasValue.length>0){
                this.RoleName = hasValue[0].roleName;
            }
            else{
                this.roles.forEach(x=>{x.isAssigned =true});
               // this.RoleName = userResult.roles[1].roleName;
            }

                    console.log(userResult.roles);
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;

            this.allOrganizationUnits = userResult.allOrganizationUnits;
            this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;

            this.getProfilePicture(userId);


            if (userId) {
                this.active = true;

                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);

                this.sendActivationEmail = false;
                this._beneficiaryService.getUserBank(this.user.userName).subscribe(result =>
                    {
                        this.userBankProfile = result;
                    });
            }

            this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
                this.modal.show();
            });
        });
    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(userId: number): void {
        if (!userId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            return;
        }

        this._profileService.getProfilePictureByUser(userId).subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            }
        });
    }

    onShown(): void {
        // this.organizationUnitTree.data = <IOrganizationUnitsTreeComponentData>{
        //     allOrganizationUnits: this.allOrganizationUnits,
        //     selectedOrganizationUnits: this.memberedOrganizationUnits
        // };

       // document.getElementById('Name').focus();

        // this.loadCategories();
        this. getCompanyStructure(4)
        this.loadBankList();
        this.loadCustomCodes();
    }
    radioChecked(id, i){
        // this.roles.forEach(item=>{
        //     if(item.roleId !=id){
        //      item.isAssigned = false;
        //     }
        //     else{
        //         item.isAssigned = true;
        //     }
        // })

        console.log(id);
    }

    save(): void {



        let input = new CreateOrUpdateUserInput();




        input.user = this.user;
        input.user.categoryId=4;

        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        this.roles.forEach(x=>{
            x.roleName = this.RoleName;
        })
        input.assignedRoleNames =
            _map(

                _filter(this.roles, { isAssigned: true, inheritedFromOrganizationUnit: false }), role => role.roleName
            );

        input.organizationUnits = null;  //this.organizationUnitTree.getSelectedOrganizations();

        this.saving = true;
        this._userService.createOrUpdateUser(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });


        this.userBankProfile.beneficiaryCode = this.user.userName;
        this.userBankProfile.beneficiaryType = 3;

        this._beneficiaryService.createOrEdit(this.userBankProfile).subscribe(result =>
            {
                this.modalSave.emit(null);
            });

    }

    close(): void {
        this.active = false;
        this.userPasswordRepeat = '';
        this.modal.hide();
    }

    getAssignedRoleCount(): number {
        return _filter(this.roles, { isAssigned: true }).length;
    }

    isSMTPSettingsProvided(): boolean {
        return this.s('Abp.Net.Mail.DefaultFromAddress') !== '' ||
            this.s('Abp.Net.Mail.Smtp.Host') !== '' ||
            this.s('Abp.Net.Mail.Smtp.UserName') !== '' ||
            this.s('Abp.Net.Mail.Smtp.Password') !== '';
    }

    loadCustomCodes()
    {
        this._companyStructureService.getCompanyStructures().subscribe(result =>
             {
                 this.customCodeList = result;
                });

    }

    loadBankList()
    {
        this._bankService.getActiveBankList().subscribe(result =>
            {
                this.Banks = result;
                console.log(result);
            }
        );
   }

    loadCategories(){
        this._userService.getCoyCategory(
        ).subscribe(result =>
            {

        this.categoryList = result;
        // this.primengTableHelper.hideLoadingIndicator();yea
        console.log(result);
        console.log(this.categoryList);
        });
        }


        getCompanyStructure(val:any)
        {

        this._userService.getCompanyStructures(val).subscribe(result => {
            this.listCompanyStructure = result;
            console.log(this.listCompanyStructure);

        });
        }
        getStaffsMisCodee(val:any)
        {

        this._userService.getCoyStructureStaffCode(val).subscribe(result => {
            this.CompanyStructureStaffMisdto = result;


            console.log("this is staff mis")
            console.log(this.listCompanyStructure);
          //  this.user.misCode = null;
        });
        }

        fetchMis(val){
             this.getDeptCode(val);
             this.getStaffsMisCodee(val)
        }

        getDeptCode(miscode:any)
        {

        this._userService.getCoyStructureDeptCode(miscode).subscribe(result => {
            this.CompanyStructuredto= result;
            this.user.departmentMisCode=result.parentCode;
            console.log(this.CompanyStructuredto);
            //this.user.misCode = null;
        });
        }

        getAllUsers(){
            this._userService.getUserList().subscribe((result)=>{
                this.usersList = result;
            })
        }


        getCustCode(val:any)
        {
            this._userService.getCustCode(val).subscribe(result =>
                {
                 this.custCodeList = result;
                 console.log(this.custCodeList);
        });
        }


    }
