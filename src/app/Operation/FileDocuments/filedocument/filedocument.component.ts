import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ServiceTypeDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'filedocument',
  templateUrl: './filedocument.component.html',
  styleUrls: ['./filedocument.component.css']
})
export class FiledocumentComponent extends AppComponentBase implements OnInit {

  constructor(injector:Injector) {
    super(injector)
   }
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  serviceTypeDto: ServiceTypeDto = new ServiceTypeDto();
  ngOnInit() {
  }

  show(Id?: number): void {

    if (!Id) {
       
        this.modal.show();
    }  
    this.modal.show(); 
}
close(): void {
  this.active = false;
  this.modal.hide();
  }

 
}
