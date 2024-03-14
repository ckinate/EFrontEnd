import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { BeneficiaryAccountProfilesServiceProxy, CreateOrEditBeneficiaryAccountProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditBeneficiaryAccountProfileModal',
    templateUrl: './create-or-edit-beneficiaryAccountProfile-modal.component.html'
})
export class CreateOrEditBeneficiaryAccountProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    beneficiaryAccountProfile: CreateOrEditBeneficiaryAccountProfileDto = new CreateOrEditBeneficiaryAccountProfileDto();



    constructor(
        injector: Injector,
        private _beneficiaryAccountProfilesServiceProxy: BeneficiaryAccountProfilesServiceProxy
    ) {
        super(injector);
    }

    show(beneficiaryAccountProfileId?: number): void {

        if (!beneficiaryAccountProfileId) {
            this.beneficiaryAccountProfile = new CreateOrEditBeneficiaryAccountProfileDto();
            this.beneficiaryAccountProfile.id = beneficiaryAccountProfileId;

            this.active = true;
            this.modal.show();
        } else {
            this._beneficiaryAccountProfilesServiceProxy.getBeneficiaryAccountProfileForEdit(beneficiaryAccountProfileId).subscribe(result => {
                this.beneficiaryAccountProfile = result.beneficiaryAccountProfile;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._beneficiaryAccountProfilesServiceProxy.createOrEdit(this.beneficiaryAccountProfile)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
