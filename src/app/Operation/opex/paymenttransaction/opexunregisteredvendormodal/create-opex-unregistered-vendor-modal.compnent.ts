import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { finalize } from 'rxjs/operators';
import {
    CreateOpexUnregisteredVendorDto,
    BankDto,
    BankServiceServiceProxy,
    VendorsServiceProxy,
    OperatingExpenseServiceServiceProxy,
    VendorDto,
    VendorCategoryDto,
    VendorSubCategoryDto
 } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { empty } from 'rxjs';
import { LazyLoadEvent } from 'primeng/public_api';




@Component({
    selector: 'createVendorOpexModal',
    templateUrl: './create-opex-unregistered-vendor-modal.component.html',
})

export class CreateVendorOpexModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createVendorOpexModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    vendorOpexDto: CreateOpexUnregisteredVendorDto = new CreateOpexUnregisteredVendorDto();
    active = false;
    saving = false;
    vcid: any;
    Vendor_OpexBank: any;
    Vendor_OpexAccountNumber: string;
    Vendor_OpexAccountName: any;
    Vendor_OpexEmail: any;
    Vendor_OpexCompanyName: any;
    vendorOpexForm: NgForm;
    vendorNumber: any;
    VendorCategoryId: any;
    companyNameFilter: any;
    bankList: BankDto[] = [];
    getListOfVendors: VendorDto[] = [];
    VenCategory: VendorCategoryDto[] = [];
    SubCategory: VendorSubCategoryDto[] = [];

    // tslint:disable-next-line:no-output-rename
    @Output('getAllVendorList') getAllVendorList: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line:no-output-rename
    @Output('getVendorNumberItem') getVendorNumberItem: EventEmitter<any> = new EventEmitter();



    constructor(
        injector: Injector,
        private _vendorsServiceProxy: VendorsServiceProxy,
        private _bankService: BankServiceServiceProxy,
        private _opex: OperatingExpenseServiceServiceProxy,
       private notifiers: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getAllBankList();
      //  this.getVenCategory();
       // this.getVenSubCategory(vcid);
    }

    show(): void {
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
    }

    saveUnRegisteredVendorOpex() {
        this.saving = true;
       //// this.vendorOpexDto = new CreateOpexUnregisteredVendorDto();
        this.vendorOpexDto.accountName = this.Vendor_OpexAccountName;
        this.vendorOpexDto.accountNumber = this.Vendor_OpexAccountNumber;
        this.vendorOpexDto.bank = this.Vendor_OpexBank;
        this.vendorOpexDto.email = 'NULL';
        this.vendorOpexDto.companyName = this.Vendor_OpexAccountName;

        console.log(this.vendorOpexDto.companyName);
        console.log(this.vendorOpexDto);
        this._opex.createOpexVendor(this.vendorOpexDto)
        .pipe(finalize(() => {
            this.saving = false;
        }))
        .subscribe((result) => {
            this.saving = false;
            console.log(result, 'checker');
            this.getVendorNumberItem.emit(result);

            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            //this.   = this.getAllVendorList();
            this.getAllVendorList.emit();
            this.modalSave.emit(null);

            this.Vendor_OpexAccountNumber = null;
            this.Vendor_OpexAccountName = '';
            this.Vendor_OpexEmail = '';
            this.Vendor_OpexBank = '';
            this.Vendor_OpexCompanyName = '';
        });
       
    }

    keyPressNumbersDecimal(event) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode !== 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    getAllBankList() {
        this._opex.getListOfBanks().subscribe((result) => {
            this.bankList = result;
        });
    }
    // OnSelectCategory(value) {
    //     this.VendorCategoryId = value;
    //     this.getVenSubCategory(this.VendorCategoryId);
    //   }
    // getVenCategory() {
    //     console.log('VenCategory Request');
    //     this._vendorsServiceProxy.getVenCategory().subscribe((result: any) => {
    //       this.VenCategory = result;
    //       console.log('Result: ' + result);
    //       console.log('Result: ' + this.VenCategory[0][1]);
    //       console.log('VenCategory Return');
    //     });
    //   }

    //   getVenSubCategory(vcid) {
    //     this.SubCategory = [];
    //     this._vendorsServiceProxy.getVendorSubCatByCatId(vcid).subscribe((result: any) => {
    //       this.SubCategory = result;
    //     });
    //   }

    // getAllVendorList(){
    //     this.getListOfVendors = [];
    //     this._opex.getAllListOfVendors().subscribe((result) => {
    //         return result;
    //     });
    // }
}


