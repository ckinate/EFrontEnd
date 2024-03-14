import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { OperatingExpenseServiceServiceProxy, OperationsTrackerServiceServiceProxy, OperationTrackerDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { OperationtrackerremindermodalComponent } from '../operationtrackerremindermodal/operationtrackerremindermodal.component';
import { OperationtrailmodalComponent } from '../operationtrailmodal/operationtrailmodal.component';

@Component({
  selector: 'operationtrackerbarmodal',
  templateUrl: './operationtrackerbarmodal.component.html',
  styleUrls: ['./operationtrackerbarmodal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class OperationtrackerbarmodalComponent extends AppComponentBase implements OnInit, AfterViewInit{
  saving = false;

  //chartOfAcct: ChartOfAccountDto[] = [];

  taxationForm: NgForm;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('paoperationTrailModal', { static: true }) operationTrailModal: OperationtrailmodalComponent;
  @ViewChild('operationTrackerReminderModal', { static: true }) operationTrackerReminderModal: OperationtrackerremindermodalComponent;
  primengTableHelper = new PrimengTableHelper();
  selectedRef:any;

  // taxation:  CreateTaxationDto = new CreateTaxationDto();

   active = false;
  constructor(injector: Injector,
    public _oprstrackerservice:OperationsTrackerServiceServiceProxy,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _opex:OperatingExpenseServiceServiceProxy,
   
    ) {

super(injector);
}

  ngOnInit(): void {
    let xId = 0;
    xId = this._activatedRoute.snapshot.queryParams['id'];
  
    this._activatedRoute.queryParams.subscribe(params =>{
      this.selectedRef = params['OPD'];
      console.log(this.selectedRef);
    });



    this.getTrackerByRef();
   
   // this.loadTaxation();
   }

  ngAfterViewInit(): void {

  

  }

 

 

  getTrackerByRef() {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //     this.paginator.changePage(0);

    //     return;
    // }
    this.primengTableHelper.showLoadingIndicator();
    this._oprstrackerservice.getTracker(this.selectedRef
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {

      this.primengTableHelper.records = result;
      this.primengTableHelper.hideLoadingIndicator();
       console.log(result);
    });
  }
  

  viewTrail(ref:any){
    this.operationTrailModal.show(ref);
  }

  sendreminder(record:OperationTrackerDto){
     

   

   
    this.message.confirm(
        "You Want To Proceed With This Email Reminder",
        this.l("AreYouSure"),
        (isConfirmed) => {
            if (isConfirmed) {
                this.showMainSpinner();
                this.primengTableHelper.isLoading = true;
                this.saving = true;

                this._opex.expenseReminderMail(record.operatioId,record.ref,record.operationName,record.nextActionBy).subscribe((s) => {
                  this.message.info(this.l("Mail Sent Successfully"));
                  //this.comment = "";
                 
                  setInterval(function () {
                    window.location.reload();
                      }, 2000); 
                 
          
              })

                this.hideMainSpinner();
               
          }
        }
  
    )

}



}
