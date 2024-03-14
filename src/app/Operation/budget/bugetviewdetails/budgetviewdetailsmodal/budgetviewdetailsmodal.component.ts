import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BudgetManagerServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'budgetViewDetailsModal',
  templateUrl: './budgetviewdetailsmodal.component.html',
  styleUrls: ['./budgetviewdetailsmodal.component.css']
})
export class BudgetviewdetailsmodalComponent extends AppComponentBase
implements OnInit {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    active = false;

    
    saving = false;

    //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

   
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    primengTableHelper = new PrimengTableHelper();
  
   

    constructor(
        injector: Injector,
        private _bugetservice:BudgetManagerServiceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
       
    }

    show(refNo: number): void {
        this.active = true;
        
   this.viewBudgetDetails(refNo);
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    onShown(): void {}


    viewBudgetDetails(refno:any){
      this.primengTableHelper.showLoadingIndicator();
      this._bugetservice.viewApprovedBudgetDetails(refno
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
  
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
         console.log(result);
      });
      
     }


}
