
import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { OpexpaymentdetailsComponent } from './opex/opexpaymentdetails/opexpaymentdetails.component';
import { PaymenttransactionComponent } from './opex/paymenttransaction/paymenttransaction.component';
import { CAPaymenttransactionComponent } from './cashadvance/capaymenttransaction/capaymenttransaction.component';
import { CashAdvancepaymentdetailsComponent } from './cashadvance/cashadvancepaymentdetails/cashadvancepaymentdetails.component';
import { BudgetComponent } from './budget/budget/budget.component';
import { CashRetirementComponent } from './cashadvance/cashretirement/cashretirement.component';
import { CashRetirementpaymentdetailsComponent } from './cashadvance/cashretirementpaymentdetails/cashretirementpaymentdetails.component';
import { AccrualrequisitionComponent } from './accrual/accrualrequisition/accrualrequisition.component';
import { ReportsComponent } from './reports/reports.component';
import { ForceCashRetirementComponent } from './cashadvance/forcecashretirement/forcecashretirement.component';
import { OpexPayReportComponent } from './reports/opexpayreport/opex-pay-report.component';
import { CAReportComponent } from './reports/careport/careport.component';
import { OutStandCaReportComponent } from './reports/outstandcareport/out-stand-ca-report.component';
import { CacalloverreportComponent } from './reports/cacalloverreport/cacalloverreport.component';
import { CalloverreportComponent } from './reports/calloverreport/calloverreport.component';
import { BankpostingComponent } from './bankposting/bankposting.component';
import { QuerydetailsComponent } from './querydetails/querydetails.component';
import { OperationtrackerbarmodalComponent } from '@app/shared/layout/operationtracker-bar/operationtrackerbarmodal/operationtrackerbarmodal.component';

import { ExpenseBycategoryComponent } from './reports/expense-bycategory/expense-bycategory.component';
import { PaymentsComponent } from './payments/payments.component';
import { TransactionHistoryComponent } from './payments/transaction-history.component';
import { DelegationComponent } from './reports/delegation/delegation.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {                                 //app/Operation/payroll
                path: '',
                children: [
                    { path: 'paymentTransaction', component:PaymenttransactionComponent },
                    { path: 'opexPaymentDetails', component:OpexpaymentdetailsComponent},
                    { path: 'capaymentTransaction/:OPID', component:CAPaymenttransactionComponent},
                    { path: 'cardTransaction/:OPID', component:CAPaymenttransactionComponent},
                    { path: 'cashadvancePaymentDetails', component:CashAdvancepaymentdetailsComponent },
                  //  {path: 'budget', component:BudgetComponent},
                    {path: 'cardretirement/:OPID', component:CashRetirementComponent , data:{ permission: 'Pages.CashAdvance'}},
                    {path: 'cashretirement/:OPID', component:CashRetirementComponent, data:{ permission: 'Pages.CashAdvance'} },
                    {path:'cashretirementPaymentDetails',component:CashRetirementpaymentdetailsComponent},
                    {path:'accrualrequisition',component:AccrualrequisitionComponent},
                    {path: 'forcecashretirement', component:ForceCashRetirementComponent, data:{ permission: 'Pages.ForceCashRetirement'}},
                    {path: 'reports', component:ReportsComponent, data: { permission: 'Pages.ExpenseReport' }},
                    {path: 'reports/opexpayreport', component:OpexPayReportComponent, data: { permission: 'Pages.OPEXPaymentReport' }},
                    {path: 'reports/careport', component:CAReportComponent, data: { permission: 'Pages.CashAdvanceReport' }},
                    {path: 'reports/outstandcareport', component:OutStandCaReportComponent, data: { permission: 'Pages.AccrualReport' }},
                    {path: 'reports/cacalloverreport', component:CacalloverreportComponent, data: { permission: 'Pages.CompletedExpenseReport' }},
                    {path: 'reports/calloverreport', component:CalloverreportComponent, data: { permission: 'Pages.AmortisationReport' }},
                    {path: 'reports/categoryexpense', component:ExpenseBycategoryComponent, data: { permission: 'Pages.GroupExpenseReport' }},
                    {path: 'reports/delegation', component:DelegationComponent, data: { permission: 'Pages.DelegationReport' }},
                    {path: 'bank/posting', component:BankpostingComponent},
                    {path: 'expense/history', component:TransactionHistoryComponent},
                    {path: 'expense/userhistory/:id', component:TransactionHistoryComponent},
                    {path: 'querydetails', component:QuerydetailsComponent},
                    { path: 'operationtrackerbarmodal', component: OperationtrackerbarmodalComponent },
                    {path: 'payments', component: PaymentsComponent },



                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OperationRoutingModule {

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
