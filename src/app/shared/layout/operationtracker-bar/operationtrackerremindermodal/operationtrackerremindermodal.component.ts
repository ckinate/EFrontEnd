import { AfterViewInit, Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OperatingExpenseServiceServiceProxy, OperationTrackerDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'operationTrackerReminderModal',
  templateUrl: './operationtrackerremindermodal.component.html',
  styleUrls: ['./operationtrackerremindermodal.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class OperationtrackerremindermodalComponent extends AppComponentBase implements OnInit{
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('queryreply' , {static: true}) modal: ModalDirective;
  isshow: boolean = false;
  Refnumber: string;
  comment:string;
  operationId:any;
   operationName:any;
   authorizers:any;
  expenseReminder: OperationTrackerDto = new OperationTrackerDto();
  constructor(injector: Injector,
    public _opex:OperatingExpenseServiceServiceProxy,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
   
    ) {

super(injector);
}

  ngOnInit(): void {
   


 
   
   // this.loadTaxation();
   }

  ngAfterViewInit(): void {

  

  }

  show(record: OperationTrackerDto): void {
 
    this.Refnumber= record.ref;

   
  this.comment="";
 
  
    this.operationId=record.operatioId;
     this.operationName=record.operationName;
     this.authorizers=record.nextActionBy;
    this.modal.show();
}
onShown(): void {

}
close(): void {
    this.modal.hide();
}

savereminder(){
     

   

   
      this.message.confirm(
          "You Want To Proceed With This Request",
          this.l("AreYouSure"),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.showMainSpinner();
                  this.primengTableHelper.isLoading = true;
                  //this.saving = true;

                  this._opex.expenseReminderMail(this.operationId,this.Refnumber,this.operationName,this.authorizers).subscribe((s) => {
                    this.notify.info(this.l("Mail Sent Successfully"));
                    this.comment = "";
                   
                    setInterval(function () {
                      window.location.reload();
                        }, 2000); 
                   this.close();
            
                })

                  this.hideMainSpinner();
                 
            }
          }
    
      )

}

 

 

 


}
