
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { requestItems } from '@app/admin/posting-logs/data';
import { FileuploadComponent } from '@app/operation/FileDocuments/fileupload/fileupload.component';
import { OpexquerymodalComponent } from '@app/operation/opex/opexpaymentdetails/opexquerymodal/opexquerymodal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CadPaymentDetails, CashAdvanceServiceServiceProxy, ExpenseReportServiceServiceProxy, OperatingExpenseServiceServiceProxy, OperationsTrackerServiceServiceProxy, WorkflowQueryDto, WorkflowQueryTrailsDto, WorkflowServiceServiceProxy, WorkflowTrailDto } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'cashAdViewHistorymodal',
  templateUrl:'./cashAdViewHistory.component.html',
  styleUrls: ['./cashAdViewHistory.component.css']
})
export class CashAdViewHistoryComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
        private _opex: OperatingExpenseServiceServiceProxy,   
         private _workflowService: WorkflowServiceServiceProxy,
           private _transReport: ExpenseReportServiceServiceProxy,
            private _cashad: CashAdvanceServiceServiceProxy,
            private _oprstrackerservice:OperationsTrackerServiceServiceProxy) {
        super(injector);
      }
      @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
      @ViewChild('viewCashAdHistory' , {static: true}) modal: ModalDirective;

      @ViewChild("dataTable", { static: true })
      dataTable: Table;
      primengTableHelper = new PrimengTableHelper();
      isshow: boolean = false;
    Refnumber: string;
    approvalHistoryTrail: WorkflowTrailDto[] = [];
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
    itemList = [];
    isDataLoading= false;


    createworkflowtrail: WorkflowQueryTrailsDto = new WorkflowQueryTrailsDto();
    querytraillist:  WorkflowQueryTrailsDto[] = [];
    getCashAdDetail: CadPaymentDetails[]=[]

      ngOnInit(): void {
      }

      onShown(): void {

    }
    close(): void {
        this.modal.hide();

    }
    show(Ref:string, OPID: number){
        this.Refnumber = Ref;
        if(Ref == null){
        this.message.error("Select Retirement Transaction on the dropdown");
        }
        else{
            this. getQueryHistory(Ref,OPID);
           // this.ViewApproval(Ref);
            this.getDataDetail(Ref);
            this.operationtrail(Ref);
            this.modal.show();
        }

        console.log("The OperationID at Query History is " + " " + OPID)

    }
    getQueryHistory(Ref:string, OPID: number){
        this.showMainSpinner();
        // this._workflowService.getQueryHistory(Ref, OPID).subscribe((res)=>{
        //     this.hideMainSpinner();
        //  this.querytraillist = res;

        // })
        this._workflowService.getQueryTrailsHistory(Ref, OPID).subscribe((res)=>{
            this.hideMainSpinner();
         this.querytraillist = res;

        })
    }
    ViewApproval(Ref){
      this.isDataLoading = true;
         
          this._transReport.getAdvanceDetails(Ref,3).pipe(
            finalize(() => {
              this.isDataLoading = false;
            }))
            .subscribe((c) => {
            console.log(c);
            this.approvalHistoryTrail = c.approvalDetails;
            
            


          });

        }

        operationtrail(refno:any){
   
          this.primengTableHelper.showLoadingIndicator();
          this._oprstrackerservice.getTrail(refno
          ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        
            this.primengTableHelper.records = result;
           
            this.primengTableHelper.hideLoadingIndicator();
             console.log(result);
          });
         
          
         }


          getDataDetail(ref: string){
              this.showMainSpinner();
              this._cashad.getCadPaymentDetails(ref).subscribe((result)=>{
                    this.getCashAdDetail = result;
                    this.hideMainSpinner();
              })

          }

}
