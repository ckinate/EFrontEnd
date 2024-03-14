import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { BudgetManagerServiceServiceProxy, CompanyStructureServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'budgetThresholdViewModal',
  templateUrl: './budgetthresholdviewmodal.component.html',
  styleUrls: ['./budgetthresholdviewmodal.component.css']
})
export class BudgetthresholdviewmodalComponent extends AppComponentBase implements OnInit {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  active = false;

  // bensplitcost: CreateBeneficiarySplitCostDto = new CreateBeneficiarySplitCostDto();
  // saving = false;

  //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

  // splitcostForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  //taxList: TaxationDto[] = [];
  paytransId: any;
  TransactionAmount: 0;
  totalAmount: number;
 // departList: CompanyStructureDto[] = [];

  //calculatebuget=new CalculateSpiltCostBudgetDto();
  transtypeId:any;
  requestDate:any;

  constructor(injector: Injector,
     private _department: CompanyStructureServiceProxy,
    private _bugetservice:BudgetManagerServiceServiceProxy
  ) {

    super(injector);
  }

  ngOnInit(): void {
    //this.bensplitcost.amount = 0;
    //this.getDepartments('');
  }


  show(id: number): void {
    this.active = true;
    this.paytransId = id;

    this.loadThresholdViewDetails(id);
  
   // this.loadSplitCost(this.paytransId);

  

    this.modal.show();
  }


  close(): void {
    this.modal.hide();
    this.active = false;
  }

  onShown(): void {

  }

  loadThresholdViewDetails(id?: any) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.primengTableHelper.showLoadingIndicator();
    this._bugetservice.getThresholdList(this.paytransId
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
      
    });


  }


  


}
