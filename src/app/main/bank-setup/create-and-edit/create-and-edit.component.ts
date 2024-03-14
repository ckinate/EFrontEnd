import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Bank, BankDto, BankServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'bankCreateAndEdit',
  templateUrl: './create-and-edit.component.html',
  styleUrls: ['./create-and-edit.component.css']
})
export class CreateAndEditComponent extends AppComponentBase implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  bank: BankDto = new BankDto();



  constructor(
    injector: Injector,
    private _bankService:  BankServiceServiceProxy,
  )
   {
    super(injector);
   }

  ngOnInit(): void {
  }

  checkForm():boolean {
    if (this.bank) {
      if (this.bank.bankName.length > 3 && this.bank.bankCode.length > 3) {
        return false
      }
      this.notify.error("Error",  `Add a valid Bank Details`);
      return true
    }
    this.notify.error("Error",  `Add a valid Bank Details`);
    return true
  }


  show(bankId?: number): void {

    if (!bankId) {
        this.bank = new BankDto();
        this.bank.id = bankId;
        this.active = true;
        this.modal.show();
    } else {
        this._bankService.getBankById(bankId).subscribe(result => {
            this.bank = result;
            this.active = true;
            this.modal.show();
        });
    }
}


save(): void {
  if (this.checkForm()) {
    return
  }
  this.saving = true;
  this._bankService.createBank(this.bank)
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
