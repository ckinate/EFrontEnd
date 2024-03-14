import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetDebitAccountProfileForViewDto, DebitAccountProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDebitAccountProfileModal',
    templateUrl: './view-debitAccountProfile-modal.component.html'
})
export class ViewDebitAccountProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDebitAccountProfileForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDebitAccountProfileForViewDto();
        this.item.debitAccountProfile = new DebitAccountProfileDto();
    }

    show(item: GetDebitAccountProfileForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
