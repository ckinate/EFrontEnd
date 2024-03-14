import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CostAmortizationDto, OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-costamortization',
  templateUrl: './costamortization.component.html',
  styleUrls: ['./costamortization.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CostamortizationComponent extends AppComponentBase implements OnInit, AfterViewInit{

  saving = false;

  isEdit:boolean = false;
  

  amortizationForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  costamortization:  CostAmortizationDto = new CostAmortizationDto();
  cost = 25;
  amount=0;
  tempcost=0;
  update=false;
  constructor(injector: Injector,

    private _opex: OperatingExpenseServiceServiceProxy,

    ) {

super(injector);
}

  ngOnInit(): void {

    this.loadCostamortization();
  }

  ngAfterViewInit(): void {



  }




  save( amortizationForm: NgForm) {
    this.costamortization.anniversaryDate = this.cost;
    // this.amount=this.costamortization.minimumAmount;
    // this.tempcost=this.cost;
    // // if (this.costamortization.id === 0 || this.costamortization.id ===undefined) { 
      if (this.update==false) {
      this.saving = true;
      this.costamortization.tenantId = abp.session.tenantId;

      this._opex
        .createCostAmortization(this.costamortization)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.message.info("Successfully sent for appoval");
          this.notify.info(this.l('SavedSuccessfully'));
          this.loadCostamortization();
         // this.costamortization= new CostAmortizationDto();
          // this.costamortization.minimumAmount=this.amount;
          // this.cost=this.tempcost;
          this.update=true;
        });


    } else {
      this._opex
        .updateCostAmortization(this.costamortization)
        .subscribe(() => {
          this. isEdit = true;
          this.notify.info('Updated Successfully');
          this.loadCostamortization();
          this.update=true;
        });
      // this.getAuthdesignation();

    }

    this. isEdit = false;
    amortizationForm.resetForm();

  }



  loadCostamortization() {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this._opex.getCostAmortizations().subscribe(r => {
      this.costamortization = r;
      if(this.costamortization.id>0){
        this.update=true;
        this.cost=this.costamortization.anniversaryDate;
      }

    });
    // this.primengTableHelper.showLoadingIndicator();
    // this._opex.getCostAmortization(
    // ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

    //   this.primengTableHelper.records = result;
    //   this.primengTableHelper.hideLoadingIndicator();
    //    console.log(result);
    // });
  }


  edit(f:CostAmortizationDto): void {

    debugger;

    this.costamortization.id = f.id;
    this.costamortization.tenantId = f.tenantId;

    this.costamortization.anniversaryDate = f.anniversaryDate;
    this.costamortization.minimumAmount = f.minimumAmount;
    this.cost=f.anniversaryDate;
  }

  delete(d: CostAmortizationDto): void {
    this.message.confirm(
        this.l('Do you want to deactivate this account?'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.removeCostAmortization(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Deactivated'));
                    this.loadCostamortization();
                });
            }
        }
    );
  }

  activate(d: CostAmortizationDto): void {
    this.message.confirm(
        this.l('Do you want to activate this account?'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.activateCostAmortization(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadCostamortization();
                });
            }
        }
    );
  }

}
