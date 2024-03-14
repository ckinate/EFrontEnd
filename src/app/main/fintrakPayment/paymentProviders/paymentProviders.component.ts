import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { PaymentProvidersServiceProxy, PaymentProviderDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditPaymentProviderModalComponent } from './create-or-edit-paymentProvider-modal.component';

import { ViewPaymentProviderModalComponent } from './view-paymentProvider-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './paymentProviders.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PaymentProvidersComponent extends AppComponentBase {
    
    
    @ViewChild('createOrEditPaymentProviderModal', { static: true }) createOrEditPaymentProviderModal: CreateOrEditPaymentProviderModalComponent;
    @ViewChild('viewPaymentProviderModalComponent', { static: true }) viewPaymentProviderModal: ViewPaymentProviderModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    providerNameFilter = '';
    postingkeyFilter = '';
    commissionRatesFilter = '';
    paymentRateFilter = '';
    defaultFilter = -1;
    imageUrlFilter = '';




    constructor(
        injector: Injector,
        private _paymentProvidersServiceProxy: PaymentProvidersServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getPaymentProviders(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._paymentProvidersServiceProxy.getAll(
            this.filterText,
            this.providerNameFilter,
            this.postingkeyFilter,
            this.commissionRatesFilter,
            this.paymentRateFilter,
            this.defaultFilter,
            this.imageUrlFilter,
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

    createPaymentProvider(): void {
        this.createOrEditPaymentProviderModal.show();        
    }


    deletePaymentProvider(paymentProvider: PaymentProviderDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._paymentProvidersServiceProxy.delete(paymentProvider.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
