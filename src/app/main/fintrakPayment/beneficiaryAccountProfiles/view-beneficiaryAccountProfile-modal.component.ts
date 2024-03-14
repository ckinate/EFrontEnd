import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetBeneficiaryAccountProfileForViewDto, BeneficiaryAccountProfileDto , TypeOfBeneficiary} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewBeneficiaryAccountProfileModal',
    templateUrl: './view-beneficiaryAccountProfile-modal.component.html'
})
export class ViewBeneficiaryAccountProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetBeneficiaryAccountProfileForViewDto;
    typeOfBeneficiary = TypeOfBeneficiary; 


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetBeneficiaryAccountProfileForViewDto();
        this.item.beneficiaryAccountProfile = new BeneficiaryAccountProfileDto();
    }

    show(item: GetBeneficiaryAccountProfileForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
