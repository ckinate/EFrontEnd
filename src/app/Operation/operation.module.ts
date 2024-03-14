import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
//import { DashboardComponent } from './dashboard/dashboard.component';
//import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReactiveFormsModule} from '@angular/forms';

import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
//import { SetupRoutingModule } from './setup-routing.module';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ColorPickerModule} from 'primeng/colorpicker';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
//import { DashboardComponent } from '@app/main/dashboard/dashboard.component';
import { OperationRoutingModule } from './operation-routing.module';

import { PaymenttransactionComponent } from './opex/paymenttransaction/paymenttransaction.component';
import { TaxtransactionmodalComponent } from './opex/paymenttransaction/taxtransactionmodal/taxtransactionmodal.component';
import { SplitcostmodalComponent } from './opex/paymenttransaction/splitcostmodal/splitcostmodal.component';
import { OpexpaymentdetailsComponent } from './opex/opexpaymentdetails/opexpaymentdetails.component';
import { ListboxModule } from 'primeng/listbox';
import {InputTextareaModule} from 'primeng/inputtextarea';

import { OpexworkflowroutemodalComponent } from './opex/paymenttransaction/opexworkflowroutemodal/opexworkflowroutemodal.component';

import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { OpexworkflowtrailmodalComponent } from './opex/opexpaymentdetails/opexworkflowtrailmodal/opexworkflowtrailmodal.component';
import { PrepaymentComponent } from './opex/opexpaymentdetails/prepayment/prepayment.component';
import { NumberDelimitedDirective } from '@app/shared/number-delimiter.directive';
import { CAPaymenttransactionComponent } from './cashadvance/capaymenttransaction/capaymenttransaction.component';
import { CashAdvancepaymentdetailsComponent } from './cashadvance/cashadvancepaymentdetails/cashadvancepaymentdetails.component';
import { CashAdvanceworkflowroutemodalComponent } from './cashadvance/capaymenttransaction/cashadvanceworkflowroutemodal/cashadvanceworkflowroutemodal.component';
import { CashAdvanceworkflowtrailmodalComponent } from './cashadvance/cashadvancepaymentdetails/cashadvanceworkflowtrailmodal/cashadvanceworkflowtrailmodal.component';
import { CashRetirementComponent } from './cashadvance/cashretirement/cashretirement.component';
import { CASplitcostmodalComponent } from './cashadvance/cashretirement/casplitcostmodal/casplitcostmodal.component';
import { CASplitcostviewmodalComponent } from './cashadvance/cashretirementpaymentdetails/casplitcostviewmodal/casplitcostviewmodal.component';
import { CashRetirementpaymentdetailsComponent } from './cashadvance/cashretirementpaymentdetails/cashretirementpaymentdetails.component';
import { AccrualrequisitionComponent } from './accrual/accrualrequisition/accrualrequisition.component';
import { OpexaccrualmodalComponent } from './opex/paymenttransaction/opexaccrualmodal/opexaccrualmodal.component';

import { BudgetComponent } from './budget/budget/budget.component';
import { MultiplebeneficiarymodalComponent } from './opex/paymenttransaction/multiplebeneficiarymodal/multiplebeneficiarymodal.component';
import { ViewaccrualdetailsmodalComponent } from './opex/opexpaymentdetails/viewaccrualdetailsmodal/viewaccrualdetailsmodal.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FinCurrencyPipe } from '@app/shared/fincurrency.pipe';
import { mainModule } from 'process';
import { MainModule } from '@app/main/main.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { AppModule } from '@app/app.module';
import { DocumentsComponent, FINSafePipe } from './documents/documents.component';
import { PostingDetailsComponent } from '@app/main/posting/posting-details.component';
// import { OpexpendingtasktabComponent } from './opex/opexpendingtasktab/opexpendingtasktab.component';
import { ReportsComponent } from './reports/reports.component';
import { OpexpendingtasktabComponent } from './opex/paymenttransaction/opexpendingtasktab/opexpendingtasktab.component';
import { ViewaccrualsComponent } from './accrual/accrualrequisition/viewaccruals/viewaccruals.component';
import { AccrualviewdetailsmodalComponent } from './accrual/accrualrequisition/viewaccruals/accrualviewdetailsmodal/accrualviewdetailsmodal.component';
import { ForceCashRetirementComponent } from './cashadvance/forcecashretirement/forcecashretirement.component';
import { BugetviewdetailsComponent } from './budget/bugetviewdetails/bugetviewdetails.component';
import { BudgetviewdetailsmodalComponent } from './budget/bugetviewdetails/budgetviewdetailsmodal/budgetviewdetailsmodal.component';
import { CAReportComponent } from './reports/careport/careport.component';
import { OpexPayReportComponent } from './reports/opexpayreport/opex-pay-report.component';
import { OutStandCaReportComponent } from './reports/outstandcareport/out-stand-ca-report.component';
import { DropdownModule } from 'primeng/dropdown';

import { AppBsModalModule } from '@shared/common/appBsModal/app-bs-modal.module';
import { AccuralscheduleComponent } from './accrual/accrualrequisition/viewaccruals/accuralschedule/accuralschedule.component';
import { ViewBeneficiaryTransactionAccountsComponent } from './view-beneficiary-transaction-accounts/view-beneficiary-transaction-accounts.component';
import {  InputNumberModule, ProgressBarModule, TreeDragDropService } from 'primeng';
import { BankpostingComponent } from './bankposting/bankposting.component';
import { CreatemodalComponent } from './accrual/accrualrequisition/viewaccruals/createmodal/createmodal.component';
import { CacalloverreportComponent } from './reports/cacalloverreport/cacalloverreport.component';
import { CalloverreportComponent } from './reports/calloverreport/calloverreport.component';
import { SetupModule } from '@app/setup/setup.module';
import { CreateVendorOpexModalComponent } from './opex/paymenttransaction/opexunregisteredvendormodal/create-opex-unregistered-vendor-modal.compnent';
import { VendorsServiceProxy } from '@shared/service-proxies/service-proxies';
import { OpexquerymodalComponent } from './opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
 import { QuerydetailsComponent } from './querydetails/querydetails.component';
import { QueryreplymodalComponent } from './querydetails/queryreplymodal/queryreplymodal.component';
import { PostingStatusComponent } from './bankposting/posting-status.component';
import { ExpenseBycategoryComponent } from './reports/expense-bycategory/expense-bycategory.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { CoreModule } from '@metronic/app/core/core.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileuploadComponent } from './FileDocuments/fileupload/fileupload.component';
import { DocviewerComponent } from './FileDocuments/fileupload/docviewer.component';
import { DocumentloadComponent } from './FileDocuments/fileupload/documentload.component';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { CustomService } from '@app/shared/services/CustomService.Service';

import { FileUploadModule } from 'ng2-file-upload';
import { PaymentsComponent } from './payments/payments.component';
import { OpexComponent } from './payments/opex/opex.component';
import { CadComponent } from './payments/cad/cad.component';
import { CarComponent } from './payments/car/car.component';
import { TransactionHistoryComponent } from './payments/transaction-history.component';
import { WorkflowDetailsComponent } from './payments/workflow-details/workflow-details.component';

import { TabledatadisplayComponent } from './payments/workflow-details/tabledatadisplay.component';
import { NotabledatadisplayComponent } from './payments/workflow-details/notabledatadisplay.component';
import { WorkflowlpoviewdetailsComponent } from './payments/workflow-details/workflowlpoviewdetails/workflowlpoviewdetails.component';
import { QueryToInitiatorComponent } from './querydetails/QueryToInitiator/queryToInitiator.component';
import { CurrencyInputModule } from '@app/shared/currency-input-mask.module';
import { QueryHistoryComponent } from './payments/queryHistory/queryhistory.component';
import { CashAdViewHistoryComponent } from './cashadvance/cashretirement/CashAdRequestHistory/cashAdViewHistory.component';
import { DelegationComponent } from './reports/delegation/delegation.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};


NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        TableModule,
        PaginatorModule,
        ToggleButtonModule,
        ColorPickerModule,
        CommonModule,
        InputTextareaModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        OperationRoutingModule,
        CountoModule,
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        ListboxModule,
        NgSelectModule,
        InputSwitchModule,
        InputNumberModule,
        MainModule,
        AppBsModalModule,
        SetupModule,
        DropdownModule,
        FileUploadModule,
        CurrencyInputModule,


        HttpClientJsonpModule,
        ServiceProxyModule,
        ProgressBarModule,
        PerfectScrollbarModule,
        CoreModule,
        TextMaskModule,
        ImageCropperModule,
        NgxSpinnerModule,



    ],
    declarations: [


        TaxtransactionmodalComponent,
        SplitcostmodalComponent,
        OpexpaymentdetailsComponent,

        OpexworkflowroutemodalComponent,

        OpexworkflowtrailmodalComponent,
        OpexworkflowroutemodalComponent,

        PrepaymentComponent,
        CAPaymenttransactionComponent,
        CashAdvancepaymentdetailsComponent,
        CashAdvanceworkflowroutemodalComponent,
        PaymenttransactionComponent,
        CashAdvanceworkflowtrailmodalComponent,
        CashRetirementComponent,
        CASplitcostmodalComponent,
        CASplitcostviewmodalComponent,
        CashRetirementpaymentdetailsComponent,
        AccrualrequisitionComponent,
        OpexaccrualmodalComponent,
        AccuralscheduleComponent,
        BudgetComponent,

        MultiplebeneficiarymodalComponent,
        ViewaccrualdetailsmodalComponent,
        DocumentsComponent,
        FINSafePipe,
        PostingDetailsComponent,
        OpexpendingtasktabComponent,
        ViewaccrualsComponent,
        AccrualviewdetailsmodalComponent,
        ForceCashRetirementComponent,
        BugetviewdetailsComponent,
        BudgetviewdetailsmodalComponent,
        ReportsComponent,
        CAReportComponent,
        OpexPayReportComponent,
        OutStandCaReportComponent,
        CacalloverreportComponent,
        CalloverreportComponent,
        ViewBeneficiaryTransactionAccountsComponent,
        BankpostingComponent,
        CreatemodalComponent,

        CreateVendorOpexModalComponent,
        OpexquerymodalComponent,
        QuerydetailsComponent,
        QueryreplymodalComponent,
        PostingStatusComponent,
        ExpenseBycategoryComponent,
        //DashboardComponent
        FileuploadComponent,
        DocviewerComponent,
        DocumentloadComponent,
        PaymentsComponent,
        OpexComponent,
        CadComponent,
        CarComponent,
        TransactionHistoryComponent,
        WorkflowDetailsComponent,
        NotabledatadisplayComponent,
        TabledatadisplayComponent,
        WorkflowlpoviewdetailsComponent,
        QueryToInitiatorComponent,
        QueryHistoryComponent,
        CashAdViewHistoryComponent,
        DelegationComponent,


    ],

    providers: [
        VendorsServiceProxy,
        ImpersonationService,
        TreeDragDropService,
        CustomService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        DatePipe


    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
})
export class OperationModule { }
