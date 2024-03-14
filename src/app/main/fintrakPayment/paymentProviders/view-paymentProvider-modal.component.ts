import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetPaymentProviderForViewDto, PaymentProviderDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewPaymentProviderModal',
    templateUrl: './view-paymentProvider-modal.component.html'
})
export class ViewPaymentProviderModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetPaymentProviderForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetPaymentProviderForViewDto();
        this.item.paymentProvider = new PaymentProviderDto();
    }

    show(item: GetPaymentProviderForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
