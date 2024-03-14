import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CashAdvanceServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'cashadvanceWorkflowTrailModal',
  templateUrl: './cashadvanceworkflowtrailmodal.component.html',
  styleUrls: ['./cashadvanceworkflowtrailmodal.component.css']
})
export class CashAdvanceworkflowtrailmodalComponent extends AppComponentBase implements OnInit{
     
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal' , {static: true}) modal: ModalDirective;
  active = false;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
 primengTableHelper = new PrimengTableHelper();

  constructor(injector: Injector,
    private _opex: CashAdvanceServiceServiceProxy,
    ) {

    super(injector);
   }
  ngOnInit(): void {
  }

  
  show(refNo: any): void {
    this.active = true;
   // this.paytransId = id;
    console.log(refNo);
    
    //this.loadRole(id);
 
  
    this.loadCashAdvanceWorkflowTrail(refNo) ;
  
   
    this.modal.show();
  }
  
  
close(): void {
  this.modal.hide();
  this.active = false;
}

  onShown(): void {

  }


  
  loadCashAdvanceWorkflowTrail(refNo?: any) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.primengTableHelper.showLoadingIndicator();
    this._opex.getcashadvanceapprovalTrail(refNo
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
  }


}
