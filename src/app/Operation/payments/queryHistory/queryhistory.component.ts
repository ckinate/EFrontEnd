import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { OpexquerymodalComponent } from '@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, WorkflowQueryDto, WorkflowQueryTrailsDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'queryhistorymodal',
  templateUrl: './queryhistory.component.html',
  styleUrls: ['./queryhistory.component.css']
})
export class QueryHistoryComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('queryreply' , {static: true}) modal: ModalDirective;
    isshow: boolean = false;
    Refnumber: string;
    queryResponse:string;
    saving = false;
    transtypeId:any;
    requestDate:any;
    comment:any;

    responsepersone:any;
    operationname:any;
    active = false;
    operationId:any;
    concurrenceResponse=" ";



    createworkflowtrail: WorkflowQueryTrailsDto = new WorkflowQueryTrailsDto();
    querytraillist:  WorkflowQueryTrailsDto[] = [];

    OpexQuery: WorkflowQueryDto = new WorkflowQueryDto();
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;

  constructor(
    injector: Injector,
    private _opex: OperatingExpenseServiceServiceProxy,    private _workflowService: WorkflowServiceServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
  }

//   show(record: WorkflowQueryDto): void {
//       this.OpexQuery = record;
//       this.createworkflowtrail.query=this.OpexQuery.query;
//       this.Refnumber= record.refNo;
//       this.loadWorkflowqueryTrail();
//       this.modal.show();

//       console.log("The operationId is" + "" + this.OpexQuery.operationId);
//   }
  onShown(): void {

  }
  close(): void {
      this.modal.hide();
      this.active = false;
  }







  loadWorkflowqueryTrail(Ref:string, OPID: number){
      this.Refnumber = Ref;
    this.showMainSpinner();
//     this._workflowService.getQueryHistory(Ref, OPID).subscribe((res)=>{
//         this.hideMainSpinner();
//      this.querytraillist = res;

//     })
//     console.log("The OperationID at Query History is " + " " + OPID)
//     this.modal.show();

//   }
  this._workflowService.getQueryTrailsHistory(Ref, OPID).subscribe((res)=>{
    this.hideMainSpinner();
 this.querytraillist = res;

})
console.log("The OperationID at Query History is " + " " + OPID)
this.modal.show();

}


}
