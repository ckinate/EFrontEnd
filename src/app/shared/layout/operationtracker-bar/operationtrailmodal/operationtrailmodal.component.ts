import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { OperationsTrackerServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'operationTrailModal',
  templateUrl: './operationtrailmodal.component.html',
  styleUrls: ['./operationtrailmodal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class OperationtrailmodalComponent extends AppComponentBase
implements OnInit {


  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("modal", { static: true }) modal: ModalDirective;
  active = false;


  @ViewChild("dataTable", { static: true })
  dataTable: Table;
  primengTableHelper = new PrimengTableHelper();

  constructor(
    injector: Injector,
    public _oprstrackerservice:OperationsTrackerServiceServiceProxy,
   
) {
    super(injector);
}


  ngOnInit(): void {
  }


  show(ref:any): void {
    this.active = true;
   
     
    this.modal.show();
    this.operationtrail(ref);
}

close(): void {
    this.modal.hide();
    this.active = false;
}

onShown(): void {}


operationtrail(refno:any){
   
  this.primengTableHelper.showLoadingIndicator();
  this._oprstrackerservice.getTrail(refno
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    this.primengTableHelper.records = result;
   
    this.primengTableHelper.hideLoadingIndicator();
     console.log(result);
  });
 
  
 }

}
