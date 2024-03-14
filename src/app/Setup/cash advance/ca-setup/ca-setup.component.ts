import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { CreateCASetupDto, CashAdvanceServiceServiceProxy, CASetupDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import { CASetupeditComponent } from './casetupedit/casetupedit.component';
import * as XLSX from "xlsx";

@Component({

  templateUrl: './ca-setup.component.html',
  styleUrls: ['./ca-setup.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CASetupComponent extends AppComponentBase implements OnInit, AfterViewInit {


  saving = false;
  isEdit: boolean = false;
  fileName= 'CashAdvanceSetUp.xlsx';

  caSetupForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('caSetupEdit', {static:true}) caSetupEdit:CASetupeditComponent
  primengTableHelper = new PrimengTableHelper();
  caSetup:  CreateCASetupDto = new  CreateCASetupDto();

  constructor(injector: Injector,
    private _opex: CashAdvanceServiceServiceProxy,

    ) {

super(injector);
}

  ngOnInit(): void {

      this.loadcaSetup();

      this.caSetup.numberDays=0;
  }

  ngAfterViewInit(): void {



  }

  loadcaSetup() {

    this.primengTableHelper.showLoadingIndicator();
    this._opex.getCashAdvanceSetup(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
  }

  save(caSetupForm: NgForm) {

    if (this.caSetup.id === 0 || this.caSetup.id == null) {
      this.saving = true;
      this.caSetup.tenantId = abp.session.tenantId;

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

        });


    } else {
      this._opex
        .updateCASetuo(this.caSetup)
        .subscribe(() => {
          this.isEdit = true;
          this.notify.info('Updated Successfully');
          this.loadcaSetup();
          this.caSetup = new  CreateCASetupDto();
        });


    }
    this.isEdit = false;
    caSetupForm.resetForm();

  }
  showEditModal(record: CASetupDto){
    this.caSetupEdit.edit(record);
  }
  showNewModal(){
    this.caSetupEdit.show();
  }

  edit(f:CreateCASetupDto): void {

    //this.transType.chartOfAccountId = f.chartOfAccountId;
    this.caSetup.id = f.id;
    this.caSetup.tenantId = f.tenantId;
    this.caSetup.numberDays = f.numberDays;
    this.caSetup.applyDaysPayment=f.applyDaysPayment;
    this.caSetup.applyDaysRequisition=f.applyDaysRequisition;
    this.caSetup.maximumAmount=f.maximumAmount;
    this.caSetup.validateBeneficiary=f.validateBeneficiary;
    this.caSetup.transactionType=f.transactionType;
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
  frontEndExcelExport(){
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      /* the code here is use to hide the first Column that contain Action from displaying in excel */
    ws['!cols'] = [];
    ws['!cols'][0] = { hidden: true };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
