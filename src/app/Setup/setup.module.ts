import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule as PrimeNgFileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeDragDropService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SetupRoutingModule } from './setup-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';

import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


import { TaxationComponent } from './opex/taxation/taxation.component';
import { TransactionTypeComponent } from './opex/transaction-type/transaction-type.component';

import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';

import { from } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { CASetupComponent } from './cash advance/ca-setup/ca-setup.component';
import { AccrualmappingComponent } from './accrual/accrualmapping/accrualmapping.component';
import { AccrualperiodComponent } from './accrual/accrualperiod/accrualperiod.component';
// import { BudgetlevelComponent } from './budget/budgetlevel/budgetlevel.component';
import { BudgetsetupComponent } from './budget/budgetsetup/budgetsetup.component';
import { ActionNotificationComponent } from './action-notification/action-notification.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
//import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileformatComponent } from './fileformat/fileformat.component';
import { CurrencysetupComponent } from './currencysetup/currencysetup.component';
import { BudgetthresholdviewmodalComponent } from './budget/budgetsetup/budgetthresholdviewmodal/budgetthresholdviewmodal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CostamortizationComponent } from './opex/costamortization/costamortization.component';
import { DefaultAccountDetailsComponent } from './default-account-details/default-account-details.component';
import { DefaultcurrencyComponent } from './defaultcurrency/defaultcurrency.component';
import { CASetupeditComponent } from './cash advance/ca-setup/casetupedit/casetupedit.component';
import { CurrencyModalComponent } from './currencysetup/currencymodal/currencymodal.component';
import { TaxationModalComponent } from './opex/taxation/taxationmodal/taxationmodal.component';
import { TranstypeModalComponent } from './opex/transaction-type/transtypemodal/transtypemodal.component';
import { DefaultaccModalComponent } from './default-account-details/defaultaccmodal/defaultaccmodal.component';
import { InputNumberModule } from 'primeng';
import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { NibssButtonComponent } from './appTheme/nibss-button/nibss-button.component';
import { UsercategoryComponent } from './usercategory/usercategory.component';
import { UsercategorysmodalComponent } from './usercategory/usercategorysmodal/usercategorysmodal.component';
import { OtherbeneficiaryComponent } from './usercategory/otherbeneficiary.component';
import { RefnosetupComponent } from './refnosetup/refnosetup.component';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';
import { PaymentModeModalComponent } from './payment-mode/payment-mode-modal/payment-mode-modal.component';
import { MisDeactivationCriteriaComponent } from './mis-deactivation-criteria/mis-deactivation-criteria.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        CKEditorModule,
    //    AngularEditorModule,
        CommonModule,
        FormsModule,
        RadioButtonModule,
        AppCommonModule,
        UtilsModule,
        CheckboxModule,
        SetupRoutingModule,
        CountoModule,
        NgxChartsModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        UtilsModule,
        AppCommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        NgxChartsModule,
        CountoModule,
        TextMaskModule,
        ImageCropperModule,
        PerfectScrollbarModule,
        DropdownModule,
        InputSwitchModule,
        MultiSelectModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        CommonModule,
        InputNumberModule,
        AppBsModalModule

    ],
    declarations: [


        TaxationComponent,
        TransactionTypeComponent,

        CASetupComponent,
        AccrualmappingComponent,
        AccrualperiodComponent,
        // BudgetlevelComponent,
        BudgetsetupComponent,

        FileformatComponent,
        CurrencysetupComponent,
        BudgetthresholdviewmodalComponent,
        CostamortizationComponent,
        DefaultAccountDetailsComponent,
        DefaultcurrencyComponent,

        ActionNotificationComponent,
        CASetupeditComponent,
        TaxationModalComponent,
        CurrencyModalComponent,
        TranstypeModalComponent,
        DefaultaccModalComponent,
        NibssButtonComponent,
        UsercategoryComponent,
        UsercategorysmodalComponent,
        OtherbeneficiaryComponent,
        RefnosetupComponent,
        PaymentModeComponent,
        PaymentModeModalComponent,
        MisDeactivationCriteriaComponent
    ],
    exports: [
    NibssButtonComponent],
    providers: [
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})
export class SetupModule { }
