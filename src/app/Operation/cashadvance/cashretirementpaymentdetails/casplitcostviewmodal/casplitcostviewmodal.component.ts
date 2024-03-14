import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CreateBeneficiarySplitCostDto, CashRetirementServiceServiceProxy, CompanyStructureServiceProxy, CompanyStructureDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'caSplitCostViewModal',
  templateUrl: './casplitcostviewmodal.component.html',
  styleUrls: ['./casplitcostviewmodal.component.css']
})
export class CASplitcostviewmodalComponent extends AppComponentBase implements OnInit {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  active = false;

  bensplitcostview: CreateBeneficiarySplitCostDto = new CreateBeneficiarySplitCostDto();
  saving = false;

  //  taxtrans:  CreateTaxTransactionDto = new CreateTaxTransactionDto();

  splitcostviewForm: NgForm;
  @ViewChild('splitcostdataTable', { static: true }) splitcostdataTable: Table;
  splitcostprimengTableHelper = new PrimengTableHelper();
  //taxList: TaxationDto[] = [];
  paytransId: any;
  TransactionAmount: 0;
  totalAmount: number;
  departList: CompanyStructureDto[] = [];

  constructor(injector: Injector,
    private _opex: CashRetirementServiceServiceProxy, private _department: CompanyStructureServiceProxy
  ) {

    super(injector);
  }

  ngOnInit(): void {
  }


  show(id: number): void {
    this.active = true;
    this.paytransId = id;
    console.log(id);
    //this.totalAmount = amt;
    //this.loadRole(id);
    this.loadcaSplitCostview(this.paytransId);

    this.getcasDepartments("");
    console.log(this.TransactionAmount);
    
    console.log(this.totalAmount);

    this.modal.show();
  }


  close(): void {
    this.modal.hide();
    this.active = false;
  }

  onShown(): void {

  }


  getcasDepartments(search: any) {
    this._department.getAllBusinessUnits(search).subscribe((s) => {
      this.departList = s.items;
    });
  }
  selectcaDepartment(event: any) {
    console.log(event);
    this.bensplitcostview.department = event.target.value;
  }

  DeleteItem(id: any) {
    this._opex.removeCABeneficiarySplitCost(id).subscribe(() => {
      this.notify.success("Item remove successfully", "Item Deletion");
    });
    this.loadcaSplitCostview(this.paytransId);
  }

//   save(splitcostForm: NgForm) {


//     if ((this.TransactionAmount + this.bensplitcost.amount) > this.totalAmount) {

//       let v = this.bensplitcost.amount + this.TransactionAmount;
//       this.message.error("Amount splitting (" + v.toString() + ") cannot be greater than the total amount" + this.totalAmount.toString() , "Error")
//       return;
//     }
//     // if (this.bensplitcost.id === 0 || this.bensplitcost.id == null) {
//     this.saving = true;
//     this.bensplitcost.tenantId = abp.session.tenantId;
//     this.bensplitcost.paymentId = this.paytransId;
//     this._opex
//       .createCABeneficiarySplitCost(this.bensplitcost)
//       .pipe(
//         finalize(() => {
//           this.saving = false;
//         })
//       )
//       .subscribe(() => {

//         this.notify.info(this.l('SavedSuccessfully'));
//         this.loadcaSplitCost(this.paytransId);
//         //this. loadTaxation();

//         // this.approvalLevel = new CreateApprovalLevelDto();
//       });


//     // } else {
//     //   this._opex
//     //     .updateTaxTransaction(this.bensplitcost)
//     //     .subscribe(() => {

//     //       this.notify.info('Updated Successfully');

//     //     });


//     // }
//     splitcostForm.resetForm();

//   }


  loadcaSplitCostview(id?: any) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.splitcostprimengTableHelper.showLoadingIndicator();
    this._opex.getcasplitcostList(this.paytransId
    ).pipe(finalize(() => this.splitcostprimengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.splitcostprimengTableHelper.records = result;
      this.splitcostprimengTableHelper.hideLoadingIndicator();
      this.TransactionAmount = 0
      result.forEach(p => {
        this.TransactionAmount += p.amount;

      });

    });

    
  }


}
