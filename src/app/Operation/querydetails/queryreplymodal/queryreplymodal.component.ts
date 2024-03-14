import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { OpexquerymodalComponent } from '@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, WorkflowQueryDto, WorkflowQueryTrailsDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { QueryToInitiatorComponent } from '../QueryToInitiator/queryToInitiator.component';

@Component({
  selector: 'queryreplymodal',
  templateUrl: './queryreplymodal.component.html',
  styleUrls: ['./queryreplymodal.component.css']
})
export class QueryreplymodalComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('queryreply' , {static: true}) modal: ModalDirective;
    isshow: boolean = false;
    Refnumber: string;
    queryResponse:string;
    saving = false;
    transtypeId:any;
    requestDate:any;
    comment:any;
    refno:any;
    responsepersone:any;
    operationname:any;
    active = false;
    operationId:any;
    concurrenceResponse=" ";
    loginUserName: string;
    transMadeBy: string;


    createworkflowtrail: WorkflowQueryTrailsDto = new WorkflowQueryTrailsDto();
    querytraillist:  WorkflowQueryTrailsDto[] = [];

    OpexQuery: WorkflowQueryDto = new WorkflowQueryDto();
    @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
    @ViewChild("opexquerymodal", { static: true })  opexquerymodal: QueryToInitiatorComponent;
  constructor(
    injector: Injector,
    private _opex: OperatingExpenseServiceServiceProxy,    private _workflowService: WorkflowServiceServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.loginUserName = this.appSession.user.userName;
  }


  show(record: WorkflowQueryDto): void {
      this.OpexQuery = record;
      this.createworkflowtrail.query=this.OpexQuery.query;
      this.Refnumber= record.refNo;
      this.loadWorkflowqueryTrail();
      this.modal.show();

      console.log("The operationId is" + "" + this.OpexQuery.operationId);
  }
  onShown(): void {
   this.getInitiatorUserName();

  }
  close(): void {
      this.modal.hide();
      this.active = false;
  }

  save(){

      // this._opex.updateOpexQuery(this.OpexQuery).subscribe((s) => {
      //     this.notify.info(this.l("Saved Successfully"));
      //     this.OpexQuery.queryResponse = "";

      //     setInterval(function () {
      //       window.location.reload();
      //         }, 2000);
      //    this.close();

      // })
      this.message.confirm(this.l('You Want To Respond To This Query'),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this.saving = true;


          this. createworkflowtrail.queryResponse= this.comment;
          this.createworkflowtrail.queryDate=this.OpexQuery.queryDate;
          this.createworkflowtrail.query=this.OpexQuery.query;
          this.createworkflowtrail.queryInitiator=this.OpexQuery.queryInitiator;
          this.createworkflowtrail.operationId = this.OpexQuery.operationId;
          //this.createworkflowtrail.id=record.id;

          this.createworkflowtrail.transactionDate=this.OpexQuery.transactionDate;
          this.createworkflowtrail.refNo=this.OpexQuery.refNo;
          // this.OpexQuery.refNo = this.Refnumber;
          // this.OpexQuery.queryResponse = this.comment;
          //this.createworkflowtrail.tenantId = abp.multiTenancy.getTenantIdCookie();
          this._workflowService.workflowQueryTrail(this.createworkflowtrail)
            .pipe(
              finalize(() => {
                this.saving = false;
              })
            )
            .subscribe(() => {

              this.message.info("Query Successfully Responded To ");

              this.comment = null;
              this.createworkflowtrail = new WorkflowQueryTrailsDto();
              this.modalSave.emit(null);
              this.close();
            });







        }
      });




  }

  createquery() {
    this.opexquerymodal.show(this.OpexQuery.refNo, this.OpexQuery.operationId);
}
  showDocument(id: any,operationid:number){

    id = this.OpexQuery.refNo ;
   operationid =  this.OpexQuery.operationId;
     this.fileUpload.ShowAttachment(id, operationid);


   }
   noResponse(){
    this.comment="No"
    this.createworkflowtrail.concurrenceResponse="No";
     console.log(this.createworkflowtrail.concurrenceResponse)
  }
  yesResponse(){
    this.comment="Yes"
    this.createworkflowtrail.concurrenceResponse="Yes";
     console.log(this.createworkflowtrail.concurrenceResponse)
  }

  loadWorkflowqueryTrail(){
    this.showMainSpinner();
    this._workflowService.getQueryTrailsHistory(this.OpexQuery.refNo, this.OpexQuery.operationId).subscribe((res)=>{
     this.querytraillist = res;
     this.hideMainSpinner();
    })

  }

  getInitiatorUserName(){
    this.showMainSpinner();
    this._opex.transInitiatorToSendQuery( this.Refnumber, this.OpexQuery.operationId).subscribe((res)=>{
     this.transMadeBy = res;
     this.hideMainSpinner();
    })
  }


}
