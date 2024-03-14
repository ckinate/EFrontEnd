import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

// Add new Module
import { PurchaseRequisitionComponent } from './requisitions/purchaseRequisition/purchaseRequisition.component';
import { NonFixedAssetRequisitionComponent } from './requisitions/nonFixedAssetRequisition/nonFixedAssetRequisition.component';
import { BeneficiaryAccountProfilesComponent } from './fintrakPayment/beneficiaryAccountProfiles/beneficiaryAccountProfiles.component';
import { FundTransferComponent } from './fund-transfer/fund-transfer.component';
import { BankGlmappingComponent } from './bank-glmapping/bank-glmapping.component';
import { BankSetupComponent } from './bank-setup/bank-setup.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                   
                    {path:'fintrakPayment/beneficiaryAccountProfiles', component:BeneficiaryAccountProfilesComponent, data: { permission: 'Pages.OtherBeneficiarySetUp' } },
                    {path:'fund-transfer', component: FundTransferComponent, data: { permission: 'Pages.OperatingExpense.BankTransfer' } },
                    {path:'bank-glmapping', component:BankGlmappingComponent, data: { permission: 'Pages.GLMappingSetUp' } },
                    {path:'bank-setup', component:BankSetupComponent, data: { permission: 'Pages.BankSetUp' } },
                   // {path:'fintrakPayment/beneficiaryAccountProfilesComponent', component:BeneficiaryAccountProfilesComponent },
                   
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
