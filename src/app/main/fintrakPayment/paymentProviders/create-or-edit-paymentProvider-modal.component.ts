import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { PaymentProvidersServiceProxy, CreateOrEditPaymentProviderDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditPaymentProviderModal',
    templateUrl: './create-or-edit-paymentProvider-modal.component.html'
})
export class CreateOrEditPaymentProviderModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    paymentProvider: CreateOrEditPaymentProviderDto = new CreateOrEditPaymentProviderDto();



    constructor(
        injector: Injector,
        private _paymentProvidersServiceProxy: PaymentProvidersServiceProxy
    ) {
        super(injector);
    }

    show(paymentProviderId?: number): void {

        if (!paymentProviderId) {
            this.paymentProvider = new CreateOrEditPaymentProviderDto();
            this.paymentProvider.id = paymentProviderId;

            this.active = true;
            this.modal.show();
        } else {
            this._paymentProvidersServiceProxy.getPaymentProviderForEdit(paymentProviderId).subscribe(result => {
                this.paymentProvider = result.paymentProvider;


                this.active = true;
                this.modal.show();
            });
        }
        
    }

    save(): void {
            this.saving = true;

			
            this._paymentProvidersServiceProxy.createOrEdit(this.paymentProvider)
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
