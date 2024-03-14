import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AccrualMappingDto, AccrualServiceServiceProxy, ChartOfAccountDto, ChartofAccountServiceServiceProxy, CreateAccrualMappingDto, OperatingExpenseServiceServiceProxy, TransactionTypeDto } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({

  templateUrl: './accrualmapping.component.html',
  styleUrls: ['./accrualmapping.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class AccrualmappingComponent extends AppComponentBase implements OnInit, AfterViewInit {



  saving = false;
  chartOfAcct: ChartOfAccountDto[] = [];
  transactionType: TransactionTypeDto[] = [];
  records: AccrualMappingDto[] = [];

  accrualmappingForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  primengTableHelper = new PrimengTableHelper();
  accrualmapping:  CreateAccrualMappingDto = new CreateAccrualMappingDto();
  acGL: string;
  accGL:string;
  isEdit:boolean = false;

  constructor(injector: Injector,
    private _getChartOfAcct: ChartofAccountServiceServiceProxy,
    private _opex: OperatingExpenseServiceServiceProxy,
    private _accmapping: AccrualServiceServiceProxy,


    ) {

super(injector);
}

  ngOnInit(): void {

    this.loadChartofAccount();
    this.   loadAccrualMapping();
     this.loadTransactionType();
  }

  ngAfterViewInit(): void {



  }


  loadChartofAccount(){

    this._getChartOfAcct.getListChartOfAccounts().subscribe(r => {
      this.chartOfAcct = r;

    });
  }


  loadTransactionType(){
    this._opex.getTransactionType().subscribe(result =>{
      this.transactionType = result;
    })
  }

   save(accrualmappingForm: NgForm){


    this.accrualmapping.tenantId = abp.session.tenantId;
    this.accGL = this.accrualmapping.accrualGL;

    if (  this.accrualmapping.id===0 ||this.accrualmapping.id === undefined) {
      this.saving = true;

      this._accmapping
        .createAccuralMapping(this.accrualmapping)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {

          this.notify.info(this.l('SavedSuccessfully'));

          this. loadAccrualByAccuralId(this.accGL)
        console.log(this.accrualmapping.accrualGL)
         this.accrualmapping = new CreateAccrualMappingDto();
          // this.approvalLevel = new CreateApprovalLevelDto();
        });



    } else {
      this._accmapping
        .updateAccrualMapping( this.accrualmapping)
        .subscribe(() => {
          this.isEdit = true;
          this.notify.info('Updated Successfully');

          this. loadAccrualByAccuralId(this.accGL);
          this.accrualmapping = new CreateAccrualMappingDto();
        });


    }
    this.isEdit = false;
    accrualmappingForm.resetForm();

   }


   loadAccrualByAccuralId(accGl: string){


    this._accmapping.getAccMappingByAccuralGl(accGl
    ).subscribe(result => {

      this.records = result;
      // this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
   }


   loadAccrualMapping(){


    this._accmapping.getAccrualMapping(
    ).subscribe(result => {

      this.records = result;

       console.log(result);
    });
   }


   edit(f:CreateAccrualMappingDto): void {

    this.accrualmapping.accrualGL = f.accrualGL;
    this.accrualmapping.expenseGL = f.expenseGL;
    this.accrualmapping.id = f.id;

  }

  delete(accmap: AccrualMappingDto): void {
     this.acGL = accmap.accrualGL;
    this.message.confirm(
        this.l('Do you want to deactivate this account?', accmap.expenseGL),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._accmapping.deleteAccrualMapping(accmap.id).subscribe(() => {
                   // this.reloadPage();
                   this. loadAccrualByAccuralId(this.acGL)
                    this.notify.success(this.l('Successfully Deactivated'));

                });
            }
        }

    );

  }

  active(accmap: AccrualMappingDto):void{
    this.acGL = accmap.accrualGL;
    this.message.confirm(
        this.l('Do you want to activate this account?', accmap.expenseGL),
        this.l('Are You Sure'),
        isConfirmed => {
            if (isConfirmed) {
                this._accmapping.activateAccrualMapping(accmap.id).subscribe(() => {
                   // this.reloadPage();
                   this. loadAccrualByAccuralId(this.acGL)
                    this.notify.success(this.l('Successfully Activated'));

                });
            }
        }

    );
  }

}
