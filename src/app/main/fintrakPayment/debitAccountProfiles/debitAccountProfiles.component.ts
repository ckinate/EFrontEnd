import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { DebitAccountProfilesServiceProxy, DebitAccountProfileDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDebitAccountProfileModalComponent } from './create-or-edit-debitAccountProfile-modal.component';

import { ViewDebitAccountProfileModalComponent } from './view-debitAccountProfile-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './debitAccountProfiles.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DebitAccountProfilesComponent extends AppComponentBase {
    
    
    @ViewChild('createOrEditDebitAccountProfileModal', { static: true }) createOrEditDebitAccountProfileModal: CreateOrEditDebitAccountProfileModalComponent;
    @ViewChild('viewDebitAccountProfileModalComponent', { static: true }) viewDebitAccountProfileModal: ViewDebitAccountProfileModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    accountNameFilter = '';
    accountNumberFilter = '';
    bankCodeFilter = '';
    maxPaymentProviderIDFilter : number;
		maxPaymentProviderIDFilterEmpty : number;
		minPaymentProviderIDFilter : number;
		minPaymentProviderIDFilterEmpty : number;
    currencyCodeFilter = '';
    companyCodeFilter = '';




    constructor(
        injector: Injector,
        private _debitAccountProfilesServiceProxy: DebitAccountProfilesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getDebitAccountProfiles(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._debitAccountProfilesServiceProxy.getAll(
            this.filterText,
            this.accountNameFilter,
            this.accountNumberFilter,
            this.bankCodeFilter,
            this.maxPaymentProviderIDFilter == null ? this.maxPaymentProviderIDFilterEmpty: this.maxPaymentProviderIDFilter,
            this.minPaymentProviderIDFilter == null ? this.minPaymentProviderIDFilterEmpty: this.minPaymentProviderIDFilter,
            this.currencyCodeFilter,
            this.companyCodeFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createDebitAccountProfile(): void {
        this.createOrEditDebitAccountProfileModal.show();        
    }


    deleteDebitAccountProfile(debitAccountProfile: DebitAccountProfileDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._debitAccountProfilesServiceProxy.delete(debitAccountProfile.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
