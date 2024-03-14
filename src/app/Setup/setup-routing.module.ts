


import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';


import { TaxationComponent } from './opex/taxation/taxation.component';
import { TransactionTypeComponent } from './opex/transaction-type/transaction-type.component';
import { CASetupComponent } from './cash advance/ca-setup/ca-setup.component';
import { AccrualmappingComponent } from './accrual/accrualmapping/accrualmapping.component';
// import { BudgetlevelComponent } from './budget/budgetlevel/budgetlevel.component';
import { BudgetsetupComponent } from './budget/budgetsetup/budgetsetup.component';
import { AccrualperiodComponent } from './accrual/accrualperiod/accrualperiod.component';
import { BudgetComponent } from '@app/operation/budget/budget/budget.component';
import { CurrencysetupComponent } from './currencysetup/currencysetup.component';
import { FileformatComponent } from './fileformat/fileformat.component';
import { CostamortizationComponent } from './opex/costamortization/costamortization.component';
import { DefaultAccountDetailsComponent } from './default-account-details/default-account-details.component';
import { DefaultcurrencyComponent } from './defaultcurrency/defaultcurrency.component';
import { ActionNotificationComponent } from './action-notification/action-notification.component';
import { UsercategoryComponent } from './usercategory/usercategory.component';
import { OtherbeneficiaryComponent } from './usercategory/otherbeneficiary.component';
import { RefnosetupComponent } from './refnosetup/refnosetup.component';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';
import { MisDeactivationCriteriaComponent } from './mis-deactivation-criteria/mis-deactivation-criteria.component';

// import { ApprovalgroupComponent } from './approval/approvalgroup/approvalgroup.component';

// import { SlaintervalsetupComponent } from './approval/slaintervalsetup/slaintervalsetup.component';
// import { WorkflowdefinitionComponent } from './approval/workflowdefinition/workflowdefinition.component';
// import { RolemanagementComponent } from './approval/rolemanagement/rolemanagement.component';



@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [


                    { path: 'taxation', component:TaxationComponent, data:{ permission: 'Pages.TaxationSetUp' } },

                    { path: 'transactiontype', component:TransactionTypeComponent, data:{ permission: 'Pages.TransactionSetUp' } },

                    { path: 'casetup', component:CASetupComponent, data:{ permission: 'Pages.CashAdvanceSetUp' } },
                   // {path: 'accrualmapping', component: AccrualmappingComponent, data:{ permission: 'Pages.OperatingExpense' } },
                   // {path: 'accrualperiod', component: AccrualperiodComponent, data:{ permission: 'Pages.OperatingExpense' }},
                    // {path: 'budget', component:BudgetComponent},
                    {path: 'actionnotification', component: ActionNotificationComponent, data:{ permission: 'Pages.NotificationSetUp' }},
                    {path: 'budgetsetup', component:BudgetsetupComponent,  data:{ permission: 'Pages.BudgetSetUp' }},
                    {path: 'costamortizationsetup', component:CostamortizationComponent, data:{ permission: 'Pages.AmortisationSetUp' }},
                    {path: 'currencysetup', component:CurrencysetupComponent, data:{ permission: 'Pages.CurrencySetUp' }},
                    {path: 'fileformatsetup', component:FileformatComponent, data:{ permission: 'Pages.FileFormatSetUp' }},
                    {path: 'defaultaccountdetails', component: DefaultAccountDetailsComponent, data:{ permission: 'Pages.DefaultLedgerSetUp' } },
                    {path: 'defaultcurrency', component: DefaultcurrencyComponent, data:{ permission: 'Pages.DefaultCurrencySetUp' } },
                    {path: 'misDurationCriteria', component: MisDeactivationCriteriaComponent,data:{ permission: 'Pages.MisDeactivationCriteriaSetUp' } },
                    {path: 'usercategory', component: UsercategoryComponent, data:{ permission: 'Pages.UserCategorySetUp' } },
                    {path: 'otherbeneficiary', component: OtherbeneficiaryComponent, data:{ permission: 'Pages.OtherBeneficiarySetUp' } },
                    {path: 'refnosetup', component:RefnosetupComponent, data:{ permission: 'Pages.ReferenceNoSetUp' } },
                    {path: 'paymentmode', component:PaymentModeComponent,data:{ permission: 'Pages.PaymentModeSetUp' } },
                     // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
