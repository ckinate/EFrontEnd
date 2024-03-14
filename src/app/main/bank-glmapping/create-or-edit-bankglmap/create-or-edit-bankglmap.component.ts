import { Component, EventEmitter, Injector, OnInit, Output, Type, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BankDto, BankServiceServiceProxy, BeneficiaryAccountProfilesServiceProxy, ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateOrEditBeneficiaryAccountProfileDto, CurrencyDto, DefaultAccountDetailsServiceServiceProxy, GeneralOperationsServiceServiceProxy, TypeOfBeneficiary } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'createOrEditBankGLMap',
  templateUrl: './create-or-edit-bankglmap.component.html',
  styleUrls: ['./create-or-edit-bankglmap.component.css']
})
export class CreateOrEditBankglmapComponent extends AppComponentBase implements OnInit {


  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  currencyList : CurrencyDto[] = [];

  bankGLMappingProfile: CreateOrEditBeneficiaryAccountProfileDto = new CreateOrEditBeneficiaryAccountProfileDto();

  Banks : BankDto[] = [];
  chartOfAcc : ChartOfAccountDto[] = [];
  creditTypeList =  [
    TypeOfBeneficiary[TypeOfBeneficiary.Card], 
    TypeOfBeneficiary[TypeOfBeneficiary.GL]
  ]
  creditType = {
    "GL": true
  };
  

  constructor(
    injector: Injector,
    private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
    private _bankService:  BankServiceServiceProxy,
    private _chartOfAccService : ChartofAccountServiceServiceProxy,
    private _getCAChartDefault: DefaultAccountDetailsServiceServiceProxy,
    private _operationService: GeneralOperationsServiceServiceProxy
) {
    super(injector);
}

  ngOnInit(): void {
    this.loadBankList();
    this.loadChartOfAccount();
    this.getCurrencyList();
  }

  addValueCredit(mgt: string): void {
    Object.keys(this.creditType).forEach(i => {
      this.creditType[`${i}`] = false;
    })
    this.creditType[`${mgt}`] = true;
  }
 
  getSelectedBeneficiaryType(): TypeOfBeneficiary {
    let x = Object.keys(this.creditType).filter(i => {
      return this.creditType[`${i}`] == true
    });
    let y = x.length <= 0 ? TypeOfBeneficiary[TypeOfBeneficiary.GL] : x[0];
    return y == TypeOfBeneficiary[TypeOfBeneficiary.GL] ? TypeOfBeneficiary.GL : TypeOfBeneficiary.Card;
  }


  onShown(): void {
    
  }

  checkIfEqualCredit(mgt: string):boolean {
    return this.creditType[`${mgt}`] === true;
  }

  show(beneficiaryAccountProfileId?: number): void {

    if (!beneficiaryAccountProfileId) {
        this.bankGLMappingProfile = new CreateOrEditBeneficiaryAccountProfileDto();
        this.bankGLMappingProfile.id = beneficiaryAccountProfileId;
        

        this.active = true;
        this.modal.show();
    } else {
        this._beneficiaryAccountProfilesServiceProxy.getBeneficiaryAccountProfileForEdit(beneficiaryAccountProfileId).subscribe(result => {
            this.bankGLMappingProfile = result.beneficiaryAccountProfile;
            this.active = true;
            this.modal.show();
        });
    }
    
}

loadChartOfAccount()
{
  //getListChartOfAccounts()
  this._getCAChartDefault.getDefaultAccountListByCode("004").subscribe(result =>
    {
      this.chartOfAcc = result;
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

getCurrencyList() {
  this._operationService.getCurrencyList().subscribe((x) => {
      this.currencyList = x;
  });
}

save(): void {
  this.saving = true;

  this.bankGLMappingProfile.beneficiaryType = this.getSelectedBeneficiaryType();
  
  console.log(this.bankGLMappingProfile,"======");
  this._beneficiaryAccountProfilesServiceProxy.createOrEdit(this.bankGLMappingProfile)
   .pipe(finalize(() => { this.saving = false;}))
   .subscribe(() => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.close();
      this.modalSave.emit(null);
   });
}


close(): void {
this.active = false;
this.modal.hide();
}

}
