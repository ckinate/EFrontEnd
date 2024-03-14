import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WorkflowItemDetailDto, WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'workflowLpoViewDetails',
  templateUrl: './workflowlpoviewdetails.component.html',
  styleUrls: ['./workflowlpoviewdetails.component.css']
})
export class WorkflowlpoviewdetailsComponent  extends AppComponentBase implements OnInit {

  @ViewChild('modal', { static: true }) modal: ModalDirective;
  itemList = [];
  result= new WorkflowItemDetailDto();
  title: string;
  innerBody: string;
  constructor(private injector: Injector, private _service: WorkflowServiceServiceProxy) {    super(injector); }

  ngOnInit(): void {
  }

  getData(ref: string, operationId: any) {

    this._service.getWorkflowItemDetails(ref, operationId).subscribe( x => {

      console.log(x);
      x.forEach(item=>{ 
       // this.result = item;
        if (item.operationId ==40){
          let details: details = JSON.parse(item.transactionDetails);
          this.innerBody = details.Content;
          this.title = item.ref +"/"+ details.Catergory;
        }else{
          templateDetail
          let details: templateDetail = JSON.parse(item.transactionDetails);
          this.innerBody = details.Tbody;
          this.title = item.ref +"/"+ details.Subject;
        }


      })
         
    }


    );
  
this.modal.show();
  }


  close(): void {



    this.modal.hide();

  }

  onShown(): void {

  }


}

export class details{
  RequisitionNo: string;
  TemplateId:string;
  Catergory:string;
  CatergoryId: string;
  Content:string;
  }

  export class templateDetail{
    RefNo: string;
    Subject: string;
    Tbody: string;
    Madeby: string;
    }