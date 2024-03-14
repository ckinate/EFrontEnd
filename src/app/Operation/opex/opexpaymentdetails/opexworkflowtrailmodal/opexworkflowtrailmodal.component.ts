import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'opexWorkflowTrailModal',
  templateUrl: './opexworkflowtrailmodal.component.html',
  styleUrls: ['./opexworkflowtrailmodal.component.css']
})
export class OpexworkflowtrailmodalComponent extends AppComponentBase implements OnInit{
     
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal' , {static: true}) modal: ModalDirective;
  active = false;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
 primengTableHelper = new PrimengTableHelper();

  constructor(injector: Injector,
    private _opex: OperatingExpenseServiceServiceProxy,
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
 
  
    this.loadOpexWorkflowTrail(refNo) ;
  
   
    this.modal.show();
  }
  
  
close(): void {
  this.modal.hide();
  this.active = false;
}

  onShown(): void {

  }


  
  loadOpexWorkflowTrail(refNo?: any) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.primengTableHelper.showLoadingIndicator();
    this._opex.getopexapprovalTrail(refNo
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
  }


}
