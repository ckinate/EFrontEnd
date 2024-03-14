import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';

import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';

// New Import for the Modules
import { PaymentProvidersComponent } from './fintrakPayment/paymentProviders/paymentProviders.component';
import { ViewPaymentProviderModalComponent } from './fintrakPayment/paymentProviders/view-paymentProvider-modal.component';
import { CreateOrEditPaymentProviderModalComponent } from './fintrakPayment/paymentProviders/create-or-edit-paymentProvider-modal.component';

import { BeneficiaryAccountProfilesComponent } from './fintrakPayment/beneficiaryAccountProfiles/beneficiaryAccountProfiles.component';
import { ViewBeneficiaryAccountProfileModalComponent } from './fintrakPayment/beneficiaryAccountProfiles/view-beneficiaryAccountProfile-modal.component';
import { CreateOrEditBeneficiaryAccountProfileModalComponent } from './fintrakPayment/beneficiaryAccountProfiles/create-or-edit-beneficiaryAccountProfile-modal.component';
import {NonFixedAssetRequisitionComponent} from './requisitions/nonFixedAssetRequisition/nonFixedAssetRequisition.component';
import {PurchaseRequisitionComponent} from './requisitions/purchaseRequisition/purchaseRequisition.component';


// Import from PrimEng
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';
//Import from other Packages
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BankServiceServiceProxy, BeneficiaryAccountProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { BankGlmappingComponent } from './bank-glmapping/bank-glmapping.component';
import { CreateOrEditBankglmapComponent } from './bank-glmapping/create-or-edit-bankglmap/create-or-edit-bankglmap.component';
import { ContextMenuModule, DragDropModule, DropdownModule, InputSwitchModule, MultiSelectModule, RadioButtonModule } from 'primeng';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { BankSetupComponent } from './bank-setup/bank-setup.component';
import { CreateAndEditComponent } from './bank-setup/create-and-edit/create-and-edit.component';
//import { AngularEditorModule } from '@kolkov/angular-editor';
import { SetupRoutingModule } from '@app/setup/setup-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SetupModule } from '@app/setup/setup.module';
//import { PostingDetailsComponent } from './posting/posting-details.component';


NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        //CKEditorModule,
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
        FileUploadModule,
		AutoCompleteModule,
		PaginatorModule,
		EditorModule,
		InputMaskModule,
        ColorPickerModule,
        PaginatorModule,
        TreeModule,
        TableModule,
        CheckboxModule,
        ToggleButtonModule,
        ReactiveFormsModule ,
        NgSelectModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        FormsModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        DropdownModule,
        AppBsModalModule,
      //  AngularEditorModule,
        RadioButtonModule,
        CheckboxModule,
        SetupRoutingModule,
        CountoModule,
        NgxChartsModule,
        PrimeNgFileUploadModule,
        NgxChartsModule,
        TextMaskModule,
        ImageCropperModule,
        PerfectScrollbarModule,
        InputSwitchModule,
        MultiSelectModule,
        SetupModule


    ],
    declarations: [
        DashboardComponent,

        PurchaseRequisitionComponent,
           NonFixedAssetRequisitionComponent,
        CreateOrEditBeneficiaryAccountProfileModalComponent,
          ViewBeneficiaryAccountProfileModalComponent,
          BeneficiaryAccountProfilesComponent,
        CreateOrEditPaymentProviderModalComponent,
        ViewPaymentProviderModalComponent,
        PaymentProvidersComponent,
        FundTransferComponent,
        BankGlmappingComponent,
        CreateOrEditBankglmapComponent,
        BankSetupComponent,
        CreateAndEditComponent
        //PostingDetailsComponent
    ],
    providers: [BeneficiaryAccountProfilesServiceProxy,
        BankServiceServiceProxy,
       // BankPostingTransactionServiceServiceProxy,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },

        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class MainModule { }
