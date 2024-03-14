import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, PaymentModeDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

var that;
@Component({
  selector: 'app-payment-mode-modal',
  templateUrl: './payment-mode-modal.component.html',
  styleUrls: ['./payment-mode-modal.component.css']
})
export class PaymentModeModalComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("Createmodal", { static: true }) modal: ModalDirective;
    paymentmodeForm: NgForm;
    saving = false;
    Title:string;
    payment = new PaymentModeDto();
    selecteditem:string;
  constructor(
    injector: Injector,
        private _opex: OperatingExpenseServiceServiceProxy,
        public changeDetector: ChangeDetectorRef
) {
    super(injector);
}

  ngOnInit(): void {

  }
  onShown(): void {}

  save(){
      if(this.selecteditem == undefined || this.selecteditem == ""){
        this.message.error(
            "Please supply a valid Payment Mode",
            "Error"
        );
      }else{
      if(this.payment.id == 0 || this.payment.id == undefined || this.payment.id == null){
        this.payment.description = this.selecteditem;
        this._opex.createPaymentMode(this.payment).subscribe((x) => {
            if (x) {
                this.notify.success(
                    this.l("Saved Successfully")
                );
                location.reload();
            } else {
            }
        });
      }else{
        this.payment.description = this.selecteditem;
        this._opex.updatePaymentMode(this.payment).subscribe((x) => {
            if (x) {
                this.notify.success(
                    this.l("Updated Successfully")
                );
            } else {
            }
        });
      }
      this.modal.hide();
    }
  }

  show(item: PaymentModeDto){
      if(item.id == 0 || item.id == undefined || item.id == null){
        this.payment = new PaymentModeDto();
        this.selecteditem= "";
        this.Title = "Create Payment Mode"
      }else{
        this.Title = "Edit Payment Mode";
        this.payment = item;
        this.selecteditem = item.description;
      }
    this.modal.show();
  }
  close(): void {
    this.modal.hide();
}


}
