import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { BeneficiaryAccountProfilesServiceProxy, BeneficiaryAccountProfileDto , TypeOfBeneficiary } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditBeneficiaryAccountProfileModalComponent } from './create-or-edit-beneficiaryAccountProfile-modal.component';

import { ViewBeneficiaryAccountProfileModalComponent } from './view-beneficiaryAccountProfile-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './beneficiaryAccountProfiles.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class BeneficiaryAccountProfilesComponent extends AppComponentBase implements OnInit, AfterViewInit {
    
    
    @ViewChild('createOrEditBeneficiaryAccountProfileModal', { static: true }) createOrEditBeneficiaryAccountProfileModal: CreateOrEditBeneficiaryAccountProfileModalComponent;
    @ViewChild('viewBeneficiaryAccountProfileModalComponent', { static: true }) viewBeneficiaryAccountProfileModal: ViewBeneficiaryAccountProfileModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    beneficiaryTypeFilter = -1;
    beneficiaryNameFilter = '';
    beneficiaryCodeFilter = '';
    beneficiaryAccountNumberFilter = '';
    bankCodeFilter = '';
    beneficiaryCurrencyCodeFilter = '';
    // accountNumberTypeFilter = '';
    // companyCodeFilter = '';

    typeOfBeneficiary = TypeOfBeneficiary;



    constructor(
        injector: Injector,
        private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getBeneficiaryAccountProfiles(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._beneficiaryAccountProfilesServiceProxy.getAll(
            this.filterText,
            this.beneficiaryTypeFilter,
            this.beneficiaryNameFilter,
            this.beneficiaryCodeFilter,
            this.beneficiaryAccountNumberFilter,
            this.bankCodeFilter,
            this.beneficiaryCurrencyCodeFilter,
            // this.accountNumberTypeFilter,
            // this.companyCodeFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createBeneficiaryAccountProfile(): void {
        this.createOrEditBeneficiaryAccountProfileModal.show();        
    }


    deleteBeneficiaryAccountProfile(beneficiaryAccountProfile: BeneficiaryAccountProfileDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._beneficiaryAccountProfilesServiceProxy.delete(beneficiaryAccountProfile.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
