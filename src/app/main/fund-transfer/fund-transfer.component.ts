import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BeneficiaryAccountProfilesServiceProxy, BeneficiaryAccountProfileDto, TypeOfPaymentStatus , TypeOfBeneficiary, FundingMasterDto, FundingDetailsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

export interface BeneficiaryAccountProfileDtoWithAmount {
  beneficiaryAccountProfileDto: BeneficiaryAccountProfileDto
  amount: Number
}

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent extends AppComponentBase {
  form: NgForm;
  primengTableHelper = new PrimengTableHelper();
  beneficiaryTypeList = [
    TypeOfBeneficiary[TypeOfBeneficiary.Card], 
    TypeOfBeneficiary[TypeOfBeneficiary.GL],
    // TypeOfBeneficiary[TypeOfBeneficiary.Customer], 
    // TypeOfBeneficiary[TypeOfBeneficiary.Staff],
    // TypeOfBeneficiary[TypeOfBeneficiary.Vendor]
 ];
  debitTypeList = [
    // TypeOfBeneficiary[TypeOfBeneficiary.Card], 
    TypeOfBeneficiary[TypeOfBeneficiary.GL]
  ];
  creditTypeList = this.beneficiaryTypeList;
  debitType = {};
  creditType = {};
  debitAccountListing: BeneficiaryAccountProfileDto[];
  creditAccountListing: BeneficiaryAccountProfileDto[];
  selectedDebitAccount: BeneficiaryAccountProfileDto;
  selectedCreditAccount: BeneficiaryAccountProfileDtoWithAmount[] = [];
  selectedCreditHolder: BeneficiaryAccountProfileDto[]=[];
  selectedType = this.debitTypeList[0];
  selectedTypeCredit = this.creditTypeList[0];
  dropdownSettings : IDropdownSettings = {};
  amount = 0;
  saving = false;

 
  


  checkIfEqual(mgt: string):Boolean {
    return this.selectedType.toLowerCase() == mgt.toLowerCase();
  }

  checkIfEqualCredit(mgt: string):Boolean {
    return this.selectedTypeCredit.toLowerCase() == mgt.toLowerCase();
  }

  checkIfCreditTypeIsSelected(): Boolean {
    var selected = false;
    Object.keys(this.creditType).forEach(i => {
      if (this.creditType[`${i}`] == true) {
        selected = true;
      }
    });
    return selected;
  }

  setCreditTypes = () => {
    this.creditTypeList.map(i => {
      this.creditType[`${i}`] = false;
    });
    this.creditType[`${TypeOfBeneficiary[TypeOfBeneficiary.Card]}`] = false;
    this.getCreditAccount(TypeOfBeneficiary[TypeOfBeneficiary.Card]);
  }

  setDebitTypes = () => {
    this.debitTypeList.map(i => {
      this.debitType[`${i}`] = false;
    });
    this.debitType[`${TypeOfBeneficiary[TypeOfBeneficiary.GL]}`] = true;
    this.getDebitAccount(TypeOfBeneficiary[TypeOfBeneficiary.GL]);
  }

  addValue(mgt: string): void {
    Object.keys(this.debitType).forEach(i => {
      this.debitType[`${i}`] = false;
    })
    this.debitType[`${mgt}`] = true;
    this.selectedDebitAccount = null;
    this.getDebitAccount(mgt);
  }

  addValueCredit(mgt: string): void {
    Object.keys(this.creditType).forEach(i => {
      this.creditType[`${i}`] = false;
    })
    this.creditType[`${mgt}`] = true;
    this.selectedCreditHolder = null;
    this.getCreditAccount(mgt);
  }
 
  checkIfDebitAccSelected (): boolean {
    return true;
  }

  checkIfCreditAccSelected (): boolean {
    return true && this.amount > 0;
  }

  changeDebitAccount(account : BeneficiaryAccountProfileDto){
    this.selectedDebitAccount = account;
  }

  removeCreditAccount(account: BeneficiaryAccountProfileDtoWithAmount) {
    var temp = this.selectedCreditAccount.filter(i => (i.beneficiaryAccountProfileDto.id != account.beneficiaryAccountProfileDto.id));
    this.selectedCreditHolder = null;
    this.selectedCreditAccount = temp;
    this.primengTableHelper.records = this.selectedCreditAccount;
  }

  changeCreditAccount($event){
    const x = this.creditAccountListing.filter(i => i.id == $event?.id)[0];
    const temp = this.selectedCreditAccount.filter(i => i.beneficiaryAccountProfileDto.id != $event?.id);
    temp.push({beneficiaryAccountProfileDto: x, amount: this.amount});
    this.selectedCreditAccount = temp;
    this.primengTableHelper.records = this.selectedCreditAccount;
  }

  changeCreditAccountAll($event) {
    $event.map(y => {
      const x = this.creditAccountListing.filter(i => i.id == y?.id)[0];
      const temp = this.selectedCreditAccount.filter(i => i.beneficiaryAccountProfileDto.id != y?.id);
      temp.push({beneficiaryAccountProfileDto: x, amount: this.amount});
      this.selectedCreditAccount = temp;
      this.primengTableHelper.records = this.selectedCreditAccount;
    })
  }

  unCheckCreditAccount($event){
    const temp = this.selectedCreditAccount.filter(i => i.beneficiaryAccountProfileDto.id != $event?.id);
    this.selectedCreditAccount = temp;
    this.primengTableHelper.records = this.selectedCreditAccount;
  }

  

  checkIfValid():Boolean {
    return this.selectedCreditAccount.length > 0 && this.selectedDebitAccount != null;
  }

  save(e) {
    this.saving = true;
    this.primengTableHelper.showLoadingIndicator();
    var item = this.selectedCreditAccount.map(i => {
      let details = new FundingDetailsDto();
      details.bankCode = i.beneficiaryAccountProfileDto.bankCode;
      details.beneficiaryCode  = i.beneficiaryAccountProfileDto.beneficiaryCode;
      details.beneficiaryName = i.beneficiaryAccountProfileDto.beneficiaryName;
      details.beneficiaryType = i.beneficiaryAccountProfileDto.beneficiaryType;
      details.isDebit = false;
      details.isPosted = false;
      details.amount = String(i.amount)??'0';
      details.bankAccountNumber = i.beneficiaryAccountProfileDto.beneficiaryAccountNumber;

      let master = new FundingMasterDto();
      master.coycode = this.getCompanyCode();
      master.tenantId = abp.session.tenantId;
      master.postingStatus = TypeOfPaymentStatus.Initiated;
      master.currency = "NGN";
      master.fundingDetailsDto = details;
      return master;
    });


    var details = new FundingDetailsDto();
    details.bankCode = this.selectedDebitAccount.bankCode;
    details.beneficiaryCode  = this.selectedDebitAccount.beneficiaryCode;
    details.beneficiaryName = this.selectedDebitAccount.beneficiaryName;
    details.beneficiaryType = this.selectedDebitAccount.beneficiaryType;
    details.isDebit = true;
    details.isPosted = false;
    details.bankAccountNumber = this.selectedDebitAccount.beneficiaryAccountNumber;

    var master = new FundingMasterDto();
    master.coycode = this.getCompanyCode();
    master.tenantId = abp.session.tenantId;
    master.currency = "NGN";
    master.postingStatus = TypeOfPaymentStatus.Initiated;
    master.fundingDetailsDto = details;

    item.push(master);

    try {
      this._beneficiaryAccountProfilesServiceProxy.save(item).subscribe(result => {
        console.log(result);
        this.notify.info("Fund Transfer Intiated Successfully", "Funds would be initiated immediately");
        this.selectedDebitAccount = null;
        this.saving = false;
        this.selectedCreditAccount = [];
        this.primengTableHelper.records = this.selectedCreditAccount;
        this.primengTableHelper.hideLoadingIndicator();
        // this.form.reset();
      });
    } catch (e){
      this.primengTableHelper.hideLoadingIndicator();
    }
  }

  getDebitAccount(benefitType): void {
    this.primengTableHelper.showLoadingIndicator();
    this._beneficiaryAccountProfilesServiceProxy.getBasedOnBeneficiaryType(TypeOfBeneficiary[`${benefitType}`]).subscribe(beneficiaryAccList => {
      this.debitAccountListing = beneficiaryAccList;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }

  getCreditAccount(benefitType): void {
    this.primengTableHelper.showLoadingIndicator();
    this._beneficiaryAccountProfilesServiceProxy.getBasedOnBeneficiaryType(TypeOfBeneficiary[`${benefitType}`]).subscribe(beneficiaryAccList => {
      console.log(beneficiaryAccList, this.selectedDebitAccount)
      const filter = beneficiaryAccList.filter(i => {
        return i.id != this.selectedDebitAccount.id
      });
      this.creditAccountListing = filter;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }

  constructor(
    injector: Injector,
    private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
  ) { 
    super(injector);
  }

  ngOnInit(): void {  
    this.primengTableHelper.showLoadingIndicator();
    this.addValue(this.debitTypeList[0]);
    this.checkIfEqual(this.debitTypeList[0]);
    this.saving = true;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'beneficiaryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    }
    this.setDebitTypes();
    this.setCreditTypes();
    this.saving = false;
    
  }

  

}
