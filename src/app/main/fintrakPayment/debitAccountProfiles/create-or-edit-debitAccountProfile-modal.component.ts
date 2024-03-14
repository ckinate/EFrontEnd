import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DebitAccountProfilesServiceProxy, CreateOrEditDebitAccountProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditDebitAccountProfileModal',
    templateUrl: './create-or-edit-debitAccountProfile-modal.component.html'
})
export class CreateOrEditDebitAccountProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    debitAccountProfile: CreateOrEditDebitAccountProfileDto = new CreateOrEditDebitAccountProfileDto();



    constructor(
        injector: Injector,
        private _debitAccountProfilesServiceProxy: DebitAccountProfilesServiceProxy
    ) {
        super(injector);
    }

    show(debitAccountProfileId?: number): void {

        if (!debitAccountProfileId) {
            this.debitAccountProfile = new CreateOrEditDebitAccountProfileDto();
            this.debitAccountProfile.id = debitAccountProfileId;

            this.active = true;
            this.modal.show();
        } else {
            this._debitAccountProfilesServiceProxy.getDebitAccountProfileForEdit(debitAccountProfileId).subscribe(result => {
                this.debitAccountProfile = result.debitAccountProfile;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._debitAccountProfilesServiceProxy.createOrEdit(this.debitAccountProfile)
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
