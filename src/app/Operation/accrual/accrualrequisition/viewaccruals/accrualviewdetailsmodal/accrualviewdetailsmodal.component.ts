import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AccrualServiceServiceProxy, NewAccuralRequisitionDto } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'accrualViewDetailsmodal',
  templateUrl: './accrualviewdetailsmodal.component.html',
  styleUrls: ['./accrualviewdetailsmodal.component.css']
})
export class AccrualviewdetailsmodalComponent extends AppComponentBase
implements OnInit {
  updateForm: NgForm;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
    active = false;
    saving = false;
    accrualrequisition:  NewAccuralRequisitionDto = new NewAccuralRequisitionDto();
   amounttoposted: number = 0;
   minimumamount: number = 0.0;
   results: any;
   sampleDate: DateTime;
   id: string;
    constructor(
        injector: Injector,
        private _accservice: AccrualServiceServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit(): void {

    }

  show(f:NewAccuralRequisitionDto): void {
   console.log(f);
       this.active = true;

       const self = this;
       self.active = true;
       this.amounttoposted = f.amounttoposted;
      this.sampleDate = f.endDate;
      this.id = f.id;
       self.modal.show();

    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {

    }

  save(updateForm: NgForm){
    this.accrualrequisition.amounttoposted = this.amounttoposted  ;
    this.accrualrequisition.endDate = this.sampleDate;
    this.accrualrequisition.id= this.id;
   this._accservice
      .updateNewAccrualRequisition( this.accrualrequisition)
      .subscribe(() => {

       this.notify.info('Updated Successfully');
       this.close();
       //this.loadaccrualmapping();
     });
     updateForm.resetForm();
  }


}
