import { EventEmitter,OnInit,Component, AfterViewInit, ViewEncapsulation, ViewChild, Output, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { CurrencyDto, GeneralOperationsServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
@Component({
    
  selector: 'currencyModal',
    templateUrl: './currencymodal.component.html',
    styleUrls: ['./currencymodal.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
  })
export class CurrencyModalComponent extends AppComponentBase implements OnInit, AfterViewInit{
    saving = false;
    active= false;
    currencyForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
     primengTableHelper = new PrimengTableHelper();
     currencydto: CurrencyDto = new CurrencyDto();

    currencylist: CurrencyDto[]=[];


  
 
  isReady = false;

  constructor(injector: Injector,
    private _currencyServie: GeneralOperationsServiceServiceProxy
   
      ) {
  
  super(injector);
  }
  
    ngOnInit(): void {
      this.loadcurrency();

  }
  
    ngAfterViewInit(): void {
  
  
  
    }
  
    loadcurrency() {
      // if (this.primengTableHelper.shouldResetPaging(event)) {
      //     this.paginator.changePage(0);
    
      //     return;
      // }
      this.primengTableHelper.showLoadingIndicator();
      this._currencyServie.getCurrencyList(
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
    
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
        // this.defaultaccdetails.defaultCode ="";
        // this.defaultaccdetails.accountId ="";
      });
    }
    
  
    save(currencyForm: NgForm) {
   
      if (this.currencydto.id === 0 || this.currencydto.id ===undefined) {
        this.saving = true;
        //this.currencydto.tenantId = abp.session.tenantId;
        this._currencyServie
          .createCurrency(this.currencydto)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {
    
            this.notify.info(this.l('SavedSuccessfully'));
            // this.getAuthdesignation();
             this.loadcurrency() ;
            this.currencydto = new CurrencyDto();
            this.refresh();
          });
    
    
      } else {
        this._currencyServie
          .updateCurrency(this.currencydto)
          .subscribe(() => {
            this.loadcurrency() ;
            this.notify.info('Updated Successfully');
            this.currencydto = new CurrencyDto();
            this.refresh();
          });
        // this.getAuthdesignation();
    
      }
      currencyForm.resetForm();
    
    }
    
   
    show(result:CurrencyDto): void {
      this.active = true;
      this.edit(result);
  
      this.currencydto.currencyCode = result.currencyCode;
      this.currencydto.id = result.id;
      //this.currencydto.tenantId = f.tenantId;
      this.currencydto.currencyName = result.currencyName;
      console.log(result);
  
      this.modal.show();
  }
  
    
  edit(f:CurrencyDto): void {

    this.currencydto.currencyCode = f.currencyCode;
    this.currencydto.id = f.id;
    //this.currencydto.tenantId = f.tenantId;
    this.currencydto.currencyName = f.currencyName;
  }
  delete(br:CurrencyDto) {
    this.message.confirm(
        this.l('Delete'),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
         
                this._currencyServie.deletecurrency(br.currencyCode,br.currencyName,br.active,br.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.loadcurrency();
                   
                });
            }
        }
    );
  
  }
  
  activate(br:CurrencyDto) {
    this.message.confirm(
        this.l('Activate'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
         
                this._currencyServie.activateCurrency(br).subscribe(() => {
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadcurrency();
                   
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

