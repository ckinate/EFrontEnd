import { createInput } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, WorkflowQueryDto, WorkflowQueryTrailsDto } from '@shared/service-proxies/service-proxies';

import { forEach } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'QueryToInitiatormodal',
  templateUrl: './queryToInitiator.component.html',
  styleUrls: ['./queryToInitiator.component.css']
})
export class QueryToInitiatorComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector,
        private _opex: OperatingExpenseServiceServiceProxy,
        public notifier: ChangeDetectorRef
        ) {
        super(injector);
       }

       @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
       @ViewChild('queryToInitiator' , {static: true}) modal: ModalDirective;
       @ViewChild('fileUpload', { static: true }) fileUpload: FileuploadComponent;
       Refnumber: string;
       createquery:  WorkflowQueryDto = new WorkflowQueryDto();
       saving :boolean = false;


       ngOnInit(): void {

    }
    show(RefNo:string, OpID:number){
      this.createquery.operationId = OpID;
      this.createquery.refNo = RefNo;
      this.Refnumber = RefNo;

      this.modal.show();

    }

    close(): void {
      this.modal.hide();

  }
  save(){
    console.log("The Operation IDs is", this.createquery.operationId );
     this.message.confirm(this.l('You Want To Send this Query'),
     this.l('AreYouSure'),
     isConfirmed => {
      if (isConfirmed) {
        this.saving = true;
        this.showMainSpinner();
        this.createquery.isFinanceInputerReverseToInitiator = true;
        this._opex.createOpexQuery(this.createquery).subscribe((s) => {
          this.notify.info(this.l("Send Successfully to" + " " + " " + this.createquery.queryResponder ));
          this.saving = false;
          this.hideMainSpinner();
          this.createquery = new WorkflowQueryDto();
          this.close()
          })
      }
     }
      )

  }
  getInitiatorUserName(){
    this.showMainSpinner();
    this._opex.transInitiatorToSendQuery( this.Refnumber, this.createquery.operationId).subscribe((res)=>{
     this.createquery.queryResponder = res;
     this.hideMainSpinner();
    })
  }


    onShown(): void {
      this. getInitiatorUserName();
    }
}
