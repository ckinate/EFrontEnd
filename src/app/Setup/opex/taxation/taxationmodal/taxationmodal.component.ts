import { EventEmitter,OnInit,Component, AfterViewInit, ViewEncapsulation, ViewChild, Output, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateTaxationDto, OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
@Component({
    
  selector: 'taxModal',
    templateUrl: './taxationmodal.component.html',
    styleUrls: ['./taxationmodal.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
  })
export class TaxationModalComponent extends AppComponentBase implements OnInit, AfterViewInit{
    saving = false;
 
    chartOfAcct: ChartOfAccountDto[] = [];

    taxationForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
     primengTableHelper = new PrimengTableHelper();
     taxation:  CreateTaxationDto = new CreateTaxationDto();
     active = false;
    constructor(injector: Injector,
      private _getChartOfAcct: ChartofAccountServiceServiceProxy,
      private _opex: OperatingExpenseServiceServiceProxy,
     
      ) {
  
  super(injector);
  }
  
    ngOnInit(): void {
      this.loadChartofAccount();
      this.loadTaxation();
     }
  
    ngAfterViewInit(): void {
  
  
  
    }
  
    loadChartofAccount(){

      this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
        this.chartOfAcct = r;
  
      });
    }
  
  
    save(taxationForm: NgForm) {
  
      if (this.taxation.id === 0 || this.taxation.id ===undefined) {
        this.saving = true;
        this.taxation.tenantId = abp.session.tenantId;        
        this._opex
          .createTaxation(this.taxation)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {
            this.message.info("Taxation successfully sent for appoval");
            this.notify.info(this.l('SavedSuccessfully'));
            this. loadTaxation();
            this.taxation = new CreateTaxationDto();
            this.refresh();
          });
  
  
      } else {
        this._opex
          .updateTaxation(this.taxation)
          .subscribe(() => {
           
            this.notify.info('Updated Successfully');
          this. loadTaxation();
           this.taxation = new CreateTaxationDto();
           this.refresh();
          });
        // this.getAuthdesignation();
  
      }
      taxationForm.resetForm();
  
    }

    loadTaxation() {
      // if (this.primengTableHelper.shouldResetPaging(event)) {
      //     this.paginator.changePage(0);
  
      //     return;
      // }
      this.primengTableHelper.showLoadingIndicator();
      this._opex.getAllTaxation(
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
  
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
         console.log(result);
      });
    }
    
    show(result:CreateTaxationDto): void {
      this.active = true;
      this.edit(result);
  
     
      this.taxation.chartOfAccountId = result.chartOfAccountId;
      this.taxation.id = result.id;
      this.taxation.tenantId = result.tenantId;
      this.taxation.description = result.description;
      this.taxation.rate = result.rate;
      this.taxation.witholding = result.witholding;
      console.log(result);
  
      this.modal.show();
  }
  
    
  edit(f:CreateTaxationDto): void {

    this.taxation.chartOfAccountId = f.chartOfAccountId;
    this.taxation.id = f.id;
    this.taxation.tenantId = f.tenantId;
    this.taxation.description = f.description;
    this.taxation.rate = f.rate;
    this.taxation.witholding = f.witholding;
  }
  delete(d: CreateTaxationDto): void {
    this.message.confirm(
        this.l('Do you want to deactive this account?', d.description),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.deleteTaxation(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully deactivated'));
                    this.loadTaxation();
                });
            }
        }
    );
  }
  

  activate(d: CreateTaxationDto): void {
    this.message.confirm(
        this.l('Do you want to activate this account?', d.description),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.activateTaxation(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadTaxation();
                });
            }
        }
    );
  }
  
    close(): void {
      this.modal.hide();
      this.active = false;
  }
  onShown(): void {}
  
  refresh(): void {
    window.location.reload();
}

}

