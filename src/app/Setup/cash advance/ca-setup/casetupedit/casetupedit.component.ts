import { EventEmitter,OnInit,Component, AfterViewInit, ViewEncapsulation, ViewChild, Output, Injector } from "@angular/core";
import { NgForm } from "@angular/forms";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { PrimengTableHelper } from "@shared/helpers/PrimengTableHelper";
import { CashAdvanceServiceServiceProxy, CreateCASetupDto } from "@shared/service-proxies/service-proxies";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Table } from "primeng/table";
import { finalize } from "rxjs/operators";
@Component({

  selector: 'caSetupEdit',
    templateUrl: './casetupedit.component.html',
    styleUrls: ['./casetupedit.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
  })
export class CASetupeditComponent extends AppComponentBase implements OnInit, AfterViewInit{
    saving = false;

    caSetupForm: NgForm;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild("modal", { static: true }) modal: ModalDirective;
     primengTableHelper = new PrimengTableHelper();
    caSetup:  CreateCASetupDto = new  CreateCASetupDto();
    applyDaysRequisition = null;

    applyDaysBeforePaymentDate = null;
    active = false;
    constructor(injector: Injector,
      private _opex: CashAdvanceServiceServiceProxy,

      ) {

  super(injector);
  }

    ngOnInit(): void {
        // this.loadChartofAccount();
        this.loadcaSetup();
        //this.edit();
        this.caSetup.numberDays=0;


    }

    ngAfterViewInit(): void {



    }
    changeOnDaysReq(){
      this.caSetup.applyDaysRequisition = true;
      this.caSetup.applyDaysPayment = false;
    }
    changeOnDaysPay(){
      this.caSetup.applyDaysRequisition = false
      this.caSetup.applyDaysPayment = true;
    }

    loadcaSetup() {
      // if (this.primengTableHelper.shouldResetPaging(event)) {
      //     this.paginator.changePage(0);

      //     return;
      // }
      this.primengTableHelper.showLoadingIndicator();
      this._opex.getCashAdvanceSetup(
      ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
         console.log(result);
      });
    }




    save(caSetupForm: NgForm) {
      debugger
      this.caSetup.tenantId = abp.session.tenantId;
      if (this.caSetup.id === 0 || this.caSetup.id == null) {
        if(this.caSetup.maximumAmount == null){
            return this.message.error("The maximum amount can not be null");
           }

        this.saving = true;

        this.caSetup.coycode = this.getCompanyCode();

        this._opex
          .createCASetup(this.caSetup)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {

            this.notify.info(this.l('Saved Successfully'));

           this.loadcaSetup();
           this.caSetup = new  CreateCASetupDto();
           this.close();
           this.modalSave.emit(null);
           caSetupForm.resetForm();
           this.saving = false;
           this.refresh();
          }, error=>{
            this.saving = false;
          });


      } else {

        if(this.caSetup.maximumAmount == null){
         return this.message.error("The maximum amount can not be null");
        }
        this._opex
          .updateCASetuo(this.caSetup)
          .subscribe(() => {

            this.notify.info('Updated Successfully');
            this.loadcaSetup();
            this.caSetup = new  CreateCASetupDto();
            this.close();
            this.modalSave.emit(null);
            caSetupForm.resetForm();
            this.saving = false;
           this.refresh();
           },err=>{
            this.saving = false;
           // this.message.error("");
           });
        // this.getAuthdesignation();

      }
     // caSetupForm.resetForm();




    }

    show(): void {
      this.caSetup = new  CreateCASetupDto();
      this.applyDaysRequisition = false;
      this.applyDaysBeforePaymentDate = false;
      // if (result.id==null||result.id==undefined){

      //  this.caSetup.id = result.id;
        // this.caSetup.tenantId = result.tenantId;
        // this.caSetup.numberDays = result.numberDays;
        // this.caSetup.applyDaysPayment=result.applyDaysPayment;
        // this.caSetup.applyDaysRequisition=result.applyDaysRequisition;
        // this.caSetup.maximumAmount=result.maximumAmount;
        // this.caSetup.transactionType=result.transactionType;
      // }else{
      //   this.edit(result);
      // }





      this.modal.show();
  }


    edit(f:CreateCASetupDto): void {

      this.caSetup.id = f.id;
      this.caSetup.tenantId = f.tenantId;
      this.caSetup.numberDays = f.numberDays;
      this.caSetup.applyDaysPayment=f.applyDaysPayment;
      this.caSetup.applyDaysRequisition=f.applyDaysRequisition;
      this.caSetup.maximumAmount=f.maximumAmount;
      this.caSetup.validateBeneficiary=f.validateBeneficiary;
      this.caSetup.transactionType=f.transactionType;
      this.modal.show();
    }
    activate(d: CreateCASetupDto): void {
      this.message.confirm(
          this.l('Do you want to activate this account?'),
          this.l('Are You Sure'),
          isConfirmed => {
              if (isConfirmed) {
                  this._opex.activateCASetup(d.id).subscribe(() => {
                     // this.reloadPage();
                      this.notify.success(this.l('Successfully Activated'));
                      this.loadcaSetup();
                      this.caSetup = new  CreateCASetupDto();
                    });
              }
          }
      );
    }
    deactivate(d: CreateCASetupDto): void {
      this.message.confirm(
          this.l('Do you want to deactivate this account?'),
          this.l('Are You Sure'),
          isConfirmed => {
              if (isConfirmed) {
                  this._opex.deactivateCASetup(d.id).subscribe(() => {
                     // this.reloadPage();
                      this.notify.success(this.l('Successfully Deactivated'));
                      this.loadcaSetup();
                      this.caSetup = new  CreateCASetupDto();
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

