import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'workflowRoleMetrics',
  templateUrl: './workflow-role-metrics.component.html',
  styleUrls: ['./workflow-role-metrics.component.css']
})
export class WorkflowRoleMetricsComponent extends AppComponentBase
implements OnInit  {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    active = false;

    //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

    xForm: NgForm;
   
    @ViewChild("dataTable", { static: true })
   dataTable: Table;
   primengTableHelper = new PrimengTableHelper();
    

    

    constructor(
        injector: Injector,
        private _workflowService: WorkflowServiceServiceProxy
       
    ) {
        super(injector);
    }

    ngOnInit(): void {
        
    }

    show(id: any): void {
        this.active = true;
      
        this.loadRole(id);
    
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}

  


    loadRole(id?: any) {
        
        this.primengTableHelper.showLoadingIndicator();
        this._workflowService
            .workflowRoleMetrics(id)
            .pipe(
                finalize(() =>
                    this.primengTableHelper.hideLoadingIndicator()
                )
            )
            .subscribe((result) => {
                this.primengTableHelper.records = result;
                this.primengTableHelper.hideLoadingIndicator();
               
              
            });

        
    }







    


}
