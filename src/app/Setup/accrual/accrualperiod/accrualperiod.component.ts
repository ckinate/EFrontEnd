import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AccrualPeriodDto, AccrualServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({

  templateUrl: './accrualperiod.component.html',
  styleUrls: ['./accrualperiod.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class AccrualperiodComponent extends AppComponentBase implements OnInit, AfterViewInit {



  saving = false;
  // chartOfAcct: ChartOfAccountDto[] = [];
  // transactionType: TransactionTypeDto[] = [];



  accrualperiodForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  hasDate = false;
  //mindate : DateTime;
  sampleDate: DateTime;
  periodendDate: DateTime;
  requestendDate: DateTime;
  requeststartDate: DateTime;
  accrualperiod:  AccrualPeriodDto = new AccrualPeriodDto();
 mindate = new Date();
  constructor(injector: Injector,

    private _accrualservice: AccrualServiceServiceProxy,


    ) {

super(injector);
}

  ngOnInit(): void {
   this.loadaccrualperiod()

  }

  ngAfterViewInit(): void {



  }

  save(accrualperiodForm: NgForm){

    if (this.accrualperiod.id === 0 || this.accrualperiod.id ===undefined) {
      this.saving = true;
      this.accrualperiod.tenantId = abp.session.tenantId;
      this._accrualservice
        .createAccrualPeriod(this.accrualperiod)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {

          this.notify.info(this.l('SavedSuccessfully'));
          this.loadaccrualperiod();

         this.accrualperiod = new AccrualPeriodDto();

        });


    } else {
      this._accrualservice
        .updateAccrualPeriod(this.accrualperiod)
        .subscribe(() => {

          this.notify.info('Updated Successfully');
          this.loadaccrualperiod();

         this.accrualperiod = new AccrualPeriodDto();


        });
      // this.getAuthdesignation();

    }

    accrualperiodForm.resetForm();

   }

   loadaccrualperiod(){
    this.primengTableHelper.showLoadingIndicator();
    this._accrualservice.getAccrualPeriod(
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
   }


   edit(f:AccrualPeriodDto): void {

    this.accrualperiod.periodName = f.periodName;

    this.accrualperiod.endPeriodDate = f.endPeriodDate;
    this.accrualperiod.startPeriodDate= f.startPeriodDate;
    this.accrualperiod.requestEndDate= f.requestEndDate;
    this.accrualperiod.requestStartDate= f.requestStartDate;
    this.accrualperiod.id=f.id;
   // this.startdate=f.invoiceDate.toJSDate();


  }

  delete(accperiod: AccrualPeriodDto): void {
    this.message.confirm(
        this.l('Do you want to delete this account?', accperiod.periodName),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._accrualservice.deleteAccrualPeriod(accperiod.id).subscribe(() => {
                   // this.reloadPage();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                    this.loadaccrualperiod();
                });
            }
        }
    );
  }

}
