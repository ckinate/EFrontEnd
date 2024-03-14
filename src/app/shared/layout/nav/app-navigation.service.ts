import {PermissionCheckerService} from 'abp-ng2-module';
import {AppSessionService} from '@shared/common/session/app-session.service';

import {Injectable} from '@angular/core';
import {AppMenu} from './app-menu';
import {AppMenuItem} from './app-menu-item';

@Injectable()
export class AppNavigationService {

    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {

    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'flaticon-line-graph', '/app/admin/hostDashboard'),
            new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'flaticon-line-graph', '/app/main/dashboard'),
            new AppMenuItem('Tenants', 'Pae3s', 'flaticon-list-3', '/app/admin/tenants'),
            new AppMenuItem('Editions', 'Pages.Editions', 'flaticon-app', '/app/admin/editions'),
            new AppMenuItem('Administration', 'Pages.Administration', 'flaticon-interface-8', '', [], [
              //  new AppMenuItem('Audit Trail', 'Pages.Administration.AuditTrail', 'flaticon-folder-1', '/app/admin/audit-trail'),
                new AppMenuItem('Company', 'Pages.Administration.CompanyStructure', 'flaticon-map', '/app/admin/companystructure'),
             //   new AppMenuItem('Error Log', 'Pages.Administration.ErrorLog', 'flaticon-folder-1', '/app/admin/error-log'),
                // new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'flaticon-map', '/app/admin/organization-units'),
                new AppMenuItem('Roles', 'Pages.Administration.Roles', 'flaticon-suitcase', '/app/admin/roles'),

               // new AppMenuItem('Languages', 'Pages.Administration.Languages', 'flaticon-tabs', '/app/admin/languages', ['/app/admin/languages/{name}/texts']),
                //new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/auditLogs'),


                // new AppMenuItem('Posting Logs', 'Pages.Administration.AuditLogs', 'flaticon-folder-1', '/app/admin/posting-logs' ),
               // new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'flaticon-lock', '/app/admin/maintenance'),
               // new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
              //  new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
               // new AppMenuItem('WebhookSubscriptions', 'Pages.Administration.WebhookSubscription', 'flaticon2-world', '/app/admin/webhook-subscriptions'),
               // new AppMenuItem('DynamicProperties', 'Pages.Administration.DynamicProperties', 'flaticon-interface-8', '/app/admin/dynamic-property'),
                
                new AppMenuItem('Setup', 'Pages.Administration.Host.Settings', 'flaticon-settings', '/app/admin/hostSettings'),
                new AppMenuItem('Setup', 'Pages.Administration.Tenant.Settings', 'flaticon-settings', '/app/admin/tenantSettings'),
                new AppMenuItem('Users', 'Pages.Administration.Users', 'flaticon-users', '/app/admin/users'),
              //  new AppMenuItem('Settings', '', 'flaticon-settings', '/app/admin/tenantSettings')
            ]),


            new AppMenuItem('Maintenance', 'Pages.OperatingexpenseMaintenance', 'flaticon-shapes', '', [], [

                    //new AppMenuItem('Accrual Mapping', '', 'flaticon-shapes', '/app/setup/accrualmapping'),
                   // new AppMenuItem('Accrual Period', 'Pages.OperatingExpense.Accrual', 'flaticon-shapes', '/app/setup/accrualperiod'),
                    new AppMenuItem('Accrual Requisition', 'Pages.AccrualRequisition', 'flaticon-shapes', '/app/operation/accrualrequisition'),
                    new AppMenuItem('Bank Setup', 'Pages.BankSetUp', 'flaticon-shapes', '/app/main/bank-setup'),
                //    new AppMenuItem('Budget ', 'Pages.OperatingExpense', 'flaticon-shapes', '/app/operation/budget'),
                    new AppMenuItem('Budget Setup', 'Pages.BudgetSetUp', 'flaticon-shapes', '/app/setup/budgetsetup'),
                    new AppMenuItem('Cash Advance Setup', 'Pages.CashAdvanceSetUp', 'flaticon-shapes', '/app/setup/casetup'),
                    new AppMenuItem('Cost Amortization Setup', 'Pages.AmortisationSetUp', 'flaticon-shapes', '/app/setup/costamortizationsetup'),
                    new AppMenuItem('Currency Setup ', 'Pages.CurrencySetUp', 'flaticon-shapes', '/app/setup/currencysetup'),
                    new AppMenuItem('Default Currency Setup ', 'Pages.DefaultCurrencySetUp', 'flaticon-shapes', '/app/setup/defaultcurrency'),
                    new AppMenuItem('Default Ledger Details', 'Pages.DefaultLedgerSetUp', 'flaticon-shapes', '/app/setup/defaultaccountdetails'),

                    new AppMenuItem('File Type Setup ', 'Pages.FileFormatSetUp', 'flaticon-shapes', '/app/setup/fileformatsetup'),
                    new AppMenuItem('GL - Bank Mapping', 'Pages.GLMappingSetUp', 'flaticon-shapes', '/app/main/bank-glmapping'),
                    new AppMenuItem('MIS Deactivation Duration', 'Pages.MisDeactivationCriteriaSetUp', 'flaticon-shapes', '/app/setup/misDurationCriteria'),
                    new AppMenuItem('Notification Set up', 'Pages.NotificationSetUp', 'flaticon-shapes', '/app/setup/actionnotification'),
                    new AppMenuItem('Other Beneficiary SetUp', 'Pages.OtherBeneficiarySetUp', 'flaticon-shapes', '/app/setup/otherbeneficiary'),
                    new AppMenuItem('Payment Mode Setup ', 'Pages.PaymentModeSetUp', 'flaticon-shapes', '/app/setup/paymentmode'),
                    new AppMenuItem('Reference No Setup', 'Pages.ReferenceNoSetUp', 'flaticon-shapes', '/app/setup/refnosetup'),
                    new AppMenuItem('Taxation', 'Pages.TaxationSetUp', 'flaticon-shapes', '/app/setup/taxation'),


                    new AppMenuItem('Transaction Type', 'Pages.TransactionSetUp', 'flaticon-shapes', '/app/setup/transactiontype'),

                    new AppMenuItem('User Category', 'Pages.UserCategorySetUp', 'flaticon-shapes', '/app/setup/usercategory'),


                ]),
                new AppMenuItem('Payments', 'Pages.OperatingExpense.Payment', 'flaticon-interface-8', '', [], [
                    new AppMenuItem('Bank Transfer', 'Pages.OperatingExpense.BankTransfer', 'fa fa-coins', '/app/main/fund-transfer'),
                //new AppMenuItem('OPEX', 'Pages.OperatingExpense.Payment', 'fa fa-coins', '/app/operation/opexPaymentDetails'),
                new AppMenuItem('Payments', 'Pages.OPEX.Payment', 'fa fa-coins', '/app/operation/payments'),

                // new AppMenuItem('Cash Advance ', 'Pages.CashAdvance.Payment', 'fa fa-hand-holding-usd', '/app/operation/cashadvancePaymentDetails'),
                // new AppMenuItem('Cash Retirement', 'Pages.CashRetirement.Payment', 'fa fa-money-check-alt', '/app/operation/cashretirementPaymentDetails'),
                new AppMenuItem('Txns History', 'Pages.OperatingExpense.TankedTxns', 'fa fa-money-check-alt', '/app/operation/expense/history')
            ]),
            new AppMenuItem('Reports', 'Pages.ExpenseReport', 'flaticon-interface-8', '', [], [
                new AppMenuItem('Accrual  Report', 'Pages.AccrualReport', 'fa fa-coins', '/app/operation/reports/outstandcareport'),
                new AppMenuItem('Amortization Report', 'Pages.AmortisationReport', 'fa fa-coins', '/app/operation/reports/calloverreport'),
                new AppMenuItem('Cash Advance', 'Pages.CashAdvanceReport', 'fa fa-coins', '/app/operation/reports/careport'),
                new AppMenuItem('Completed Expense Payments', 'Pages.CompletedExpenseReport', 'fa fa-coins', '/app/operation/reports/cacalloverreport'),
                new AppMenuItem('Delegation', 'Pages.DelegationReport', 'fa fa-coins', '/app/operation/reports/delegation'),
                
                new AppMenuItem('Group Expense Report', 'Pages.GroupExpenseReport', 'fa fa-coins', '/app/operation/reports/categoryexpense'),
                new AppMenuItem('OPEX Payment', 'Pages.OPEXPaymentReport', 'fa fa-coins', '/app/operation/reports/opexpayreport'),
                new AppMenuItem('OPEX Requisition', 'Pages.OPEXRequisitionReport', 'fa fa-coins', '/app/operation/reports'),

               //  new AppMenuItem('Call Over Report', '', 'fa fa-coins', '/app/operation/reports/cacalloverreport'),


               // new AppMenuItem('Cash Advance', '', 'fa fa-coins', '/app/operation/reports/careport'),
               // new AppMenuItem('Due Outstanding', '', 'fa fa-coins', '/app/operation/reports/outstandcareport'),




            ]),
                  new AppMenuItem('Requisition', 'Pages.ExpenseRequisition', 'flaticon-cogwheel', '', [], [
                 new AppMenuItem('Card Request', 'Pages.CashAdvance', 'fa fa-hand-holding-usd', '/app/operation/cardTransaction/58'),
                 new AppMenuItem('Card Retirement ', 'Pages.CashAdvance', 'fa fa-money-check-alt', '/app/operation/cardretirement/62'),
                 new AppMenuItem('Cash Adv. Retirement ', 'Pages.CashAdvance', 'fa fa-money-check-alt', '/app/operation/cashretirement/21'),
                 new AppMenuItem('Cash Advance ', 'Pages.CashAdvance', 'fa fa-hand-holding-usd', '/app/operation/capaymentTransaction/19'),

                new AppMenuItem('Force Retirement ', 'Pages.ForceCashRetirement', 'fa fa-money-check-alt', '/app/operation/forcecashretirement'),
                new AppMenuItem('OPEX ', 'Pages.OperatingExpense', 'fa fa-coins', '/app/operation/paymentTransaction'),
                new AppMenuItem('Request History', 'Pages.RequestHistory', 'fa fa-history', '/app/operation/expense/userhistory/100'),







            ]),




            // new AppMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'flaticon-shapes', '/app/admin/demo-ui-components'),

            // new AppMenuItem('Maintenance', '', 'flaticon-shapes', '', [], [
            //     new AppMenuItem('Chart of Account', '', 'flaticon-shapes', '/app/main/chartofaccount'),
            //     // new AppMenuItem('Bulk Chart Of Account', 'Pages.ChartofAccount', 'flaticon-shapes', '/app/setup/charttakeon'),
            //     new AppMenuItem('Default Account Details', '', 'flaticon-shapes', '/app/setup/defaultaccountdetails'),

            //     // new AppMenuItem('Define Period', 'Pages.FinanceSetup', 'flaticon-shapes', '/app/setup/accountperiod'),
            //     new AppMenuItem('End of Period', 'Pages.BankReconcilliation', 'flaticon-shapes', '/app/maintenance/endofperiod'),
            //     new AppMenuItem('Taxation', 'Pages.OperatingExpense', 'flaticon-shapes', '/app/setup/taxation'),
            //     new AppMenuItem('Transaction Type', 'Pages.OperatingExpense', 'flaticon-shapes', '/app/setup/transactiontype'),
            //     new AppMenuItem('Accrual Mapping', '', 'flaticon-shapes', '/app/setup/accrualmapping'),
            //     new AppMenuItem('Accrual Period', '', 'flaticon-shapes', '/app/setup/accrualperiod'),
            //     //new AppMenuItem('Budget Level', '', 'flaticon-shapes', '/app/setup/budgetlevel'),
            //     new AppMenuItem('Budget Setup', '', 'flaticon-shapes', '/app/setup/budgetsetup'),
            //     new AppMenuItem('Budget ', '', 'flaticon-shapes', '/app/operation/budget'),
            //     new AppMenuItem('Currency Setup ', '', 'flaticon-shapes', '/app/setup/currencysetup'),
            //     new AppMenuItem('File Format Setup ', '', 'flaticon-shapes', '/app/setup/fileformatsetup'),
            //     new AppMenuItem('Fin Stat', 'Pages.FinanceReport', 'flaticon-shapes', '/app/setup/finstat'),
            //     new AppMenuItem('Settings', 'Pages.BankReconcilliation', 'flaticon-shapes', '/app/setup/BankRec'),
            //     new AppMenuItem('Cash Advance Setup', 'Pages.CashAdvance', 'flaticon-shapes', '/app/setup/casetup'),
            // ]),



            //  new AppMenuItem('Processing', '', 'flaticon-interface-8', '', [], [
            //     new AppMenuItem('Expense Payment', 'Pages.OperatingExpense', 'flaticon-map', '/app/operation/opexPaymentDetails'),
            //     new AppMenuItem('Cash Advance ', '', 'flaticon-suitcase', '/app/operation/cashadvancePaymentDetails'),
            //     new AppMenuItem('Cash Retirement', '', 'flaticon-users', '/app/operation/cashretirementPaymentDetails'),
            //     new AppMenuItem('Journal Entry', '', 'flaticon-tabs', '/app/operation/journalentry'),
            //     new AppMenuItem('Reconciliation Engine', '', 'flaticon-folder-1', '/app/operation/reconciliationengine'),
            //     new AppMenuItem('Matching Environment', '', 'flaticon-lock', '/app/operation/matchingenvironment'),

            // ]),

            //  new AppMenuItem('Workflow', '', 'flaticon-map', '', [], [
            //     new AppMenuItem('Group', '', 'flaticon-shapes', '/app/setup/group'),
            //     new AppMenuItem('Level', '', 'flaticon-suitcase', '/app/setup/level'),
            //     new AppMenuItem('WF Role', '', 'flaticon-users', '/app/setup/role'),
            //     new AppMenuItem('SLA ', '', 'flaticon-tabs', '/app/setup/slaintervalsetup' ),
            //     new AppMenuItem('Forms', '', 'flaticon-folder-1', '/app/setup/forms'),
            //     new AppMenuItem('Definition', '', 'flaticon-shapes', '/app/setup/workflowdefinition'),
            //     new AppMenuItem('Use Form', '', 'flaticon-refresh', '/app/setup/useform'),
            //     new AppMenuItem('Approval Tracker', '', 'flaticon-medical', '/app/workflowapprovals/workflowtracker'),


            // ]),
            //  new AppMenuItem('Purchase', '', 'flaticon-interface-8', '', [], [
            //     new AppMenuItem('Quote SetUp', '', 'flaticon-more', '/app/main/procurement/quoteSetUp'),
            //     new AppMenuItem('Quote Preparation', '', 'flaticon-suitcase', '/app/main/procurement/quotePreparation'),
            //     new AppMenuItem('Vendor Quote', '', 'flaticon-users', '/app/main/procurement/vendorQuote'),
            //     new AppMenuItem('Bid Rating', '', 'flaticon-tabs', '/app/main/procurement/bidRating'),
            //     new AppMenuItem('Vendor Management', '', 'flaticon-interface-8', '', [], [
            //          new AppMenuItem('Vendor', '', 'flaticon-more', '/app/main/vendorMgt/vendors'),
            //          new AppMenuItem('Questionares', '', 'flaticon-suitcase', '/app/main/vendorMgt/questionares'),
            //          new AppMenuItem('DocumentUploads', '', 'flaticon-users', '/app/main/vendorMgt/documentUploads'),
            //       ]),

            // ]),

            // new AppMenuItem('Requisition', '', 'flaticon-cogwheel', '', [], [
            //     new AppMenuItem('Non Fixed Asset', '', 'flaticon-map', '/app/main/requisitions/nonFixedAssetRequisition'),
            //     new AppMenuItem('Expense Requisition', '', 'flaticon-suitcase', '/app/operation/paymentTransaction'),
            //     new AppMenuItem('Cash Advance Requisition', '', 'flaticon-users', '/app/operation/capaymentTransaction'),
            //     new AppMenuItem('Cash Retirement Requisition', '', 'flaticon-users', '/app/operation/cashretirement'),

            // ]),

            //    new AppMenuItem('Report', '', 'flaticon-interface-1', '', [], [
            //     new AppMenuItem('Financial Statement', '', 'flaticon-map', '/app/report/financereport'),
            //     new AppMenuItem('General Ledger', '', 'flaticon-suitcase', '/app/report/generalledger'),
            //     new AppMenuItem('Trial Balance', '', 'flaticon-users', '/app/report/trialbalance'),
            //     new AppMenuItem('Bank Reconciliation', '', 'flaticon-users', '/app/report/bankreconciliation'),

            // ]),


        ]);
    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null) {
                if (subMenuItem.route) {
                    return true;
                }
            } else if (this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                let isAnyChildItemActive = this.checkChildMenuItemPermission(subMenuItem);
                if (isAnyChildItemActive) {
                    return true;
                }
            }
        }
        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let menu = this.getMenu();
        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }

    private getAllMenuItemsRecursive(menuItem: AppMenuItem): AppMenuItem[] {
        if (!menuItem.items) {
            return [menuItem];
        }

        let menuItems = [menuItem];
        menuItem.items.forEach(subMenu => {
            menuItems = menuItems.concat(this.getAllMenuItemsRecursive(subMenu));
        });

        return menuItems;
    }
}
