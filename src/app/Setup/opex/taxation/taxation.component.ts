import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateTaxationDto, OperatingExpenseServiceServiceProxy, TaxationDto } from '@shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';
import { Table } from 'primeng';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { finalize } from 'rxjs/operators';
import { TaxationModalComponent } from './taxationmodal/taxationmodal.component';
import * as XLSX from "xlsx";

@Component({

  templateUrl: './taxation.component.html',
  styleUrls: ['./taxation.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]

})
export class TaxationComponent  extends AppComponentBase implements OnInit, AfterViewInit {


  saving = false;
  chartOfAcct: ChartOfAccountDto[] = [];
  isEdit:boolean = false;

  taxationForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('taxModal', {static:true}) taxModal:TaxationModalComponent
  primengTableHelper = new PrimengTableHelper();
  taxation:  CreateTaxationDto = new CreateTaxationDto();
  fileName= 'taxation.xlsx';

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

  setDefault(d: CreateTaxationDto): void {
    this.message.confirm(
        this.l('Do you want to set this record as default? Please note that the current default rate will be changed to the selected record', d.description),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._opex.setDefaultTax(d.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('Successfully set as default'));
                    this.loadTaxation();
                });
            }
        }
    );
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

        });


    } else {
      this._opex
        .updateTaxation(this.taxation)
        .subscribe(() => {
        this.isEdit = true;

          this.notify.info('Updated Successfully');
        this. loadTaxation();
         this.taxation = new CreateTaxationDto();

        });
      // this.getAuthdesignation();

    }
    this.isEdit = false;
    taxationForm.resetForm();

  }



  loadTaxation() {

    this.primengTableHelper.showLoadingIndicator();
    this._opex.getAllTaxation(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
console.log(result);
      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();

    });
  }


  edit(f:CreateTaxationDto): void {



    this.taxation.chartOfAccountId = f.chartOfAccountId;
    this.taxation.id = f.id;
    this.taxation.tenantId = f.tenantId;
    this.taxation.description = f.description;
    this.taxation.rate = f.rate;
    this.taxation.witholding = f.witholding;
    this.taxation.isDefault = f.isDefault;

  }

  delete(d: CreateTaxationDto): void {
    this.message.confirm(
        this.l('Do you want to deactivate this account?', d.description),
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
                    this.notify.success(this.l('Successfully activated'));
                    this.loadTaxation();
                });
            }
        }
    );
  }
  showEditModal(record: CreateTaxationDto){
    this.taxModal.show(record);
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
