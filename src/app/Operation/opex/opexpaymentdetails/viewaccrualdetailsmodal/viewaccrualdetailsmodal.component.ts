import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AccrualServiceServiceProxy, AccrualUtilizationDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';

@Component({
  selector: 'viewAccrualDetailsModal',
  templateUrl: './viewaccrualdetailsmodal.component.html',
  styleUrls: ['./viewaccrualdetailsmodal.component.css']
})
export class ViewaccrualdetailsmodalComponent extends AppComponentBase implements OnInit {

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal' , {static: true}) modal: ModalDirective;
  active = false;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
 primengTableHelper = new PrimengTableHelper();
 accrualutilizationrecord :AccrualUtilizationDto[]=[];

  constructor(injector: Injector,
    private _accrualservice: AccrualServiceServiceProxy,
    ) {

    super(injector);
   }
  ngOnInit(): void {
  }


  show(refNo: any): void {
    this.active = true;
   // this.paytransId = id;
    console.log(refNo);
    this.loadaccrualutilizationdetails(refNo);
    
    //this.loadRole(id);
 
  
   // this.loadOpexWorkflowTrail(refNo) ;
  
   
    this.modal.show();
  }
  
  
close(): void {
  this.modal.hide();
  this.active = false;
}

  onShown(): void {

  }


  loadaccrualutilizationdetails(refNo: string){
    
     this.primengTableHelper.showLoadingIndicator();
   this._accrualservice.getAccUtilizationByRef(refNo
     ).subscribe(result => {
   
       this.accrualutilizationrecord = result;
       
    
        this.primengTableHelper.hideLoadingIndicator();
        console.log(result);
       
     });

     
  }

}
