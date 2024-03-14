import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { requestItems } from './data';
import { NotabledatadisplayComponent } from './notabledatadisplay.component';
import { TabledatadisplayComponent } from './tabledatadisplay.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WorkflowServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'workflowdetails',
  templateUrl: './workflow-details.component.html',
  styleUrls: ['./workflow-details.component.css']
})
export class WorkflowDetailsComponent extends AppComponentBase implements OnInit {

  @ViewChild('modalDetails', { static: true }) modal: ModalDirective;
  itemList = [];

  constructor(private injector: Injector, private _service: WorkflowServiceServiceProxy) {    super(injector); }

  ngOnInit(): void {
  }

  getData(ref: string, operationId: any) {

    this.itemList = [];
    this._service.getWorkflowItemDetails(ref, operationId).subscribe( x => {
console.log(x);
      x.forEach(l => {

        this.itemList.push(new requestItems(l.title, JSON.parse(l.transactionDetails), l.isTable, true, false, false));

      });
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
