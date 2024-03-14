import { createInput } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, WorkflowQueryDto, WorkflowQueryTrailsDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';

import { forEach } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'Opexquerymodal',
  templateUrl: './opexquerymodal.component.html',
  styleUrls: ['./opexquerymodal.component.css']
})
export class OpexquerymodalComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('querymodal' , {static: true}) modal: ModalDirective;
    @ViewChild("fileUpload", { static: true })
    appdocuments: FileuploadComponent;

    Refnumber: string;
    username: number;
    UserId: string;
    isshow: boolean = false;
    Isapprovedbtn: boolean = false ;
    OpexQuery : WorkflowQueryDto = new WorkflowQueryDto();
    OpexQueryTrail : WorkflowQueryTrailsDto = new WorkflowQueryTrailsDto();
    querytraillist: WorkflowQueryTrailsDto[]=[];
    Approvedquery: WorkflowQueryDto [] = [];
    opexForm: NgForm;
    checked:boolean;
    OperationID: number;
    ViewOnly = false;
  constructor(injector: Injector,
    private _opex: OperatingExpenseServiceServiceProxy,
    private _workflowService: WorkflowServiceServiceProxy,
    public notifier: ChangeDetectorRef
    ) {
    super(injector);
   }

  ngOnInit(): void {

  }

  show(ref:any, username:number, userid: string, OpID: number): void {
      this.UserId = userid;
      this.username = username;
      this.Refnumber = ref;
      this.OperationID = OpID;
      this.getOpexQuery(ref);
      this. loadWorkflowqueryTrail(ref, OpID);
      this.ViewOnly = true;
      if (username ==100) {
        this.ViewOnly = false;
      }
      console.log("The OperationID is" + " " + OpID + " " + " " + " " +  "UserName" + " " + " " + userid);


      this.modal.show();
    }
    onShown(): void {

    }
    close(): void {
        this.modal.hide();
    }

    save(opexForm: NgForm){
        console.log("The OperationID at Saving is " + " " + this.OperationID );

                  this.OpexQuery.refNo = this.Refnumber;
                    this.OpexQuery.queryResponder = this.UserId;
                    this.OpexQuery.operationId = this.OperationID;
                    this._opex.createOpexQuery(this.OpexQuery).subscribe((s) => {
                        this.notify.info(this.l("Saved Successfully"));
                        this.getOpexQuery(this.OpexQuery.refNo);
                        })


        opexForm.resetForm();
    }

    getOpexQuery(ref: string){
        this.Refnumber = ref;
        this.primengTableHelper.showLoadingIndicator();
        this._opex
            .getOpexQuerybyRefno(this.Refnumber)
            .pipe(
                finalize(() => this.primengTableHelper.hideLoadingIndicator())
            )
            .subscribe((result) => {
                this.Approvedquery = result;
                this.primengTableHelper.records = result;
                this.primengTableHelper.hideLoadingIndicator();

            });
    }
    response(record:WorkflowQueryTrailsDto){
        this. OpexQueryTrail.queryResponse = record.queryResponse;
        this.isshow = true;

    }
   /*  approvedquery(){
        this.Approvedquery = this.Approvedquery.filter((m) => m.status != true);
        if(this.Approvedquery.length > 0){
            this.message.error(this.l("Query have not been answered"));
        }
        else{
            this._opex.approvedOpexQuery(this.Refnumber).subscribe((s) => {
                this.notify.info(this.l("Approved Successfully"));
                this.checked = false;
                this.Isapprovedbtn = false;
                this.close();
            })
        }

    } */


   loadWorkflowqueryTrail(RefNo: string, OpiD: number) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
   this.showMainSpinner();
    this._workflowService.getQueryTrailsHistory(RefNo, OpiD
    ).pipe(finalize(() =>this.hideMainSpinner())).subscribe(result => {
      this.querytraillist= result;
      console.log("The value of query is", this.querytraillist);
      console.log("The OPID is", OpiD);

      this.hideMainSpinner();
      // console.log(result);
    });
  }
    checkquery(event){
        this.Isapprovedbtn = true;
        if(this.checked == false){
            this.Isapprovedbtn = false;
        }

    }

    Cancelquery(record:WorkflowQueryDto){
        this.message.confirm(
            this.l("Do you want to proceed?"),
            this.l(
                "Please, You have just clicked to cancel this Query"
            ),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._opex.cancelOpexQuery(record).subscribe((s) => {
                        this.notify.info(this.l("Cancel Successfully"));
                        //this.close();
                        this.getOpexQuery(record.refNo);
                    })
                } else {
                    //this.DeclineComment = null;
                }
            })

    }

    showDocument(){
        if(this.OperationID == 20){
            this.OperationID = 19;
        }

         this.appdocuments.ShowAttachment(this.Refnumber, this.OperationID);

         console.log("The operationID at Document Upload is"+ " "+ this.OperationID);

       }


}
