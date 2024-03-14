import { EventEmitter,OnInit,Component, AfterViewInit, ViewEncapsulation, ViewChild, Output, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateTransactionTypeDto, OperatingExpenseServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
@Component({
    
  selector: 'transModal',
    templateUrl: './transtypemodal.component.html',
    styleUrls: ['./transtypemodal.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
  })
export class TranstypeModalComponent extends AppComponentBase implements OnInit, AfterViewInit{
    saving = false;
 
    chartOfAcct: ChartOfAccountDto[] = [];

    payTransForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
     primengTableHelper = new PrimengTableHelper();
     transType:  CreateTransactionTypeDto = new  CreateTransactionTypeDto();
     active = false;
    constructor(injector: Injector,
      private _getChartOfAcct: ChartofAccountServiceServiceProxy,
      private _opex: OperatingExpenseServiceServiceProxy,
     
      ) {
  
  super(injector);
  }
  
    ngOnInit(): void {
      this.loadChartofAccount();
      this.loadPaytrans();
    }
  
    ngAfterViewInit(): void {
  
  
  
    }
  
    loadChartofAccount(){

      this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
        this.chartOfAcct = r;
        console.log(this.chartOfAcct);
  
      });
    }
  
  
    save(payTransForm: NgForm) {
  
      if (this.transType.id === 0 || this.transType.id ===undefined) {
        this.saving = true;
        this.transType.tenantId = abp.session.tenantId;
        this._opex
          .createTransType(this.transType)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {
  
            this.notify.info(this.l('SavedSuccessfully'));
           this.loadPaytrans();
           this.transType = new  CreateTransactionTypeDto();
             this.refresh();
          });
  
  
      } else {
        this._opex
        .updateTransType(this.transType)
        .subscribe(() => {
         
          this.notify.info('Updated Successfully');
          this.loadPaytrans();
        
          this.transType = new  CreateTransactionTypeDto();
            this.refresh();
          });
        // this.getAuthdesignation();
  
      }
      payTransForm.resetForm();
  
    }

    loadPaytrans() {
      // if (this.primengTableHelper.shouldResetPaging(event)) {
      //     this.paginator.changePage(0);
  
      //     return;
      // }
      this.primengTableHelper.showLoadingIndicator();
      this._opex.getTransactionType(
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
  
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
         
      });
    }
    show(result:CreateTransactionTypeDto): void {
      this.active = true;
      this.edit(result);
  
     
      this.transType.chartOfAccountId = result.chartOfAccountId;
      this.transType.id = result.id;
      this.transType.tenantId = result.tenantId;
      this.transType.narration = result.narration;
      
  
      this.modal.show();
  }
  
    
  edit(f:CreateTransactionTypeDto): void {

    this.transType.chartOfAccountId = f.chartOfAccountId;
    this.transType.id = f.id;
    this.transType.tenantId = f.tenantId;
    this.transType.narration = f.narration;
    
  }
  delete(d: CreateTransactionTypeDto): void {
    this.message.confirm(
        this.l('Do you want to delete this account?', d.narration),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.deleteTransactionType(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.loadPaytrans();
                });
            }
        }
    );
  }
  activate(d: CreateTransactionTypeDto): void {
    this.message.confirm(
        this.l('Do you want to activate this account?', d.narration),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.activateTransactionType(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadPaytrans();
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

