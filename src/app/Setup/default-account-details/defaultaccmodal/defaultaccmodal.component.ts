import { EventEmitter,OnInit,Component, AfterViewInit, ViewEncapsulation, ViewChild, Output, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, DefaultAccount, DefaultAccountDetailsDto, DefaultAccountDetailsServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
@Component({

  selector: 'defaultaccModal',
    templateUrl: './defaultaccmodal.component.html',
    styleUrls: ['./defaultaccmodal.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
  })
export class DefaultaccModalComponent extends AppComponentBase implements OnInit, AfterViewInit{
    saving = false;
    active= false;
    defaultaccForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
    primengTableHelper = new PrimengTableHelper();

    defaultaccdetails:  DefaultAccountDetailsDto = new DefaultAccountDetailsDto();

    defaultcode: DefaultAccount[] = [];

    chartOfAcct: ChartOfAccountDto[] = [];



    isReady = false;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _defaultaccService: DefaultAccountDetailsServiceServiceProxy

      ) {

  super(injector);
  }

    ngOnInit(): void {
      this.loadChartofAccount();
  }


    ngAfterViewInit(): void {

      this.loadDefaultAcc();

      this.loadDefaultCode();



    }


 loadDefaultCode(){
  this._defaultaccService.getActiveDefaultAcc().subscribe(result => {
     this.defaultcode = result;
  })
}


loadChartofAccount(){

this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
  this.chartOfAcct = r;


});
}

    save(defaultaccForm: NgForm) {

      if (this.defaultaccdetails.id === 0 || this.defaultaccdetails.id == null) {
        this.saving = true;
        this.defaultaccdetails.tenantId = abp.session.tenantId;
        this._defaultaccService
          .createDefaultAccDetails(this.defaultaccdetails)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(x => {
            if(x != false){
                this.notify.info(this.l('SavedSuccessfully'));
                // this.getAuthdesignation();
                 this.loadDefaultAcc() ;
                this.defaultaccdetails = new DefaultAccountDetailsDto();
                this.refresh();
            }
            else{
                this.saving = false;
                this.message.error("Default Account Details already exists!");
            }
          });


      } else {
        this._defaultaccService
      .updateDefaultAccDetails(this.defaultaccdetails)
      .subscribe(() => {
        this.loadDefaultAcc() ;
        this.notify.info('Updated Successfully');
        this.defaultaccdetails = new DefaultAccountDetailsDto();
        this.refresh();
          });
        // this.getAuthdesignation();

      }
      defaultaccForm.resetForm();

    }

    loadDefaultAcc() {
      // if (this.primengTableHelper.shouldResetPaging(event)) {
      //     this.paginator.changePage(0);

      //     return;
      // }
      this.primengTableHelper.showLoadingIndicator();
      this._defaultaccService.getDefaultAccDetails(
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
        this.defaultaccdetails.defaultCode ="";
        this.defaultaccdetails.accountId ="";
      });
    }

    show(result:DefaultAccountDetailsDto): void {
      this.active = true;
      this.edit(result);
      this.defaultaccdetails.defaultCode = result.defaultCode;
      this.defaultaccdetails.id = result.id;
      this.defaultaccdetails.tenantId = result.tenantId;
      this.defaultaccdetails.accountId = result.accountId;
      console.log(result);

      this.modal.show();
  }


  edit(f:DefaultAccountDetailsDto): void {

    this.defaultaccdetails.defaultCode = f.defaultCode;
    this.defaultaccdetails.id = f.id;
    this.defaultaccdetails.tenantId = f.tenantId;
    this.defaultaccdetails.accountId = f.accountId;
  }
  delete(br:DefaultAccountDetailsDto) {
    this.message.confirm(
        this.l('Delete'),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._defaultaccService.deleteDefaultAccDetailS(br.id).subscribe(() => {
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.loadDefaultAcc();

                });
            }
        }
    );

  }
  activate(br:DefaultAccountDetailsDto) {
    this.message.confirm(
        this.l('Do you want to activate this account?'),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._defaultaccService.activateDefaultAccDetailS(br.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Activated'));
                    this.loadDefaultAcc();

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

