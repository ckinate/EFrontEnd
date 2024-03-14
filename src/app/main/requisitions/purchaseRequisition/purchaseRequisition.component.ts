import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateRequisitionDto, InventoryTypeDto, ItemDto, PurchaseRequisitionDto, PurchaseRequisitionServiceServiceProxy, QuoteCriteriaDTO, RequisitionServiceServiceProxy, StoreDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray, NgForm } from '@angular/forms';

@Component({
    templateUrl: './purchaseRequisition.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    styleUrls: ['./purchaseRequisition.component.css']
})
export class PurchaseRequisitionComponent extends AppComponentBase implements OnInit {

  @ViewChild('dataTableSetupGL', { static: true }) dataTablePurchaseRequisition: Table;
  @ViewChild('paginatorSetupGL', { static: true }) paginatorPurchaseRequisition: Paginator;

  primengTableHelperPurchaseRequisition = new PrimengTableHelper();
    

    
    quoteList: QuoteCriteriaDTO[]=[];
    
    reqDetail : PurchaseRequisitionDto = new PurchaseRequisitionDto();
    
    
    
    requisitionForm: NgForm;
    saving = false;
    loading = false;
    storeId: any;
    useName : string;
    transDate = new Date();
    startdate: moment.Moment;
    hasDate = false;
    mindate : Date;

  

    constructor(injector: Injector ,private reqService: PurchaseRequisitionServiceServiceProxy){
     super(injector)
    }

    ngOnInit():void{
       
       

      
    
    }
    selectUnitCost(event){
     this.reqDetail.unitCost = event.target.value;
     this.reqDetail.amount = this.reqDetail.quantity * this.reqDetail.unitCost;
    }

  
    InitiateRequisition( requisitionForm: NgForm){
      this.showMainSpinner();
      this.loading = true;
     
     this.reqService.createPurchaseRequisition(this.reqDetail).pipe(finalize(()=>this.loading = false)).subscribe((r)=>{
       this.notify.success(this.l("Successfully Initiated"));
       this.message.info(this.l('Saved Successfully') + ' Ref: ' + r + ' and' + 'Sent For Approval');
       this.ViewRequisition();
     })
      this.loading = false;
      this.hideMainSpinner();
    
     requisitionForm.resetForm(); 
    }
   

    ViewRequisition(){
      this.primengTableHelperPurchaseRequisition.showLoadingIndicator();
      this.reqService.getReqDetail(this.appSession.user.userName).pipe(finalize(()=>
      this.primengTableHelperPurchaseRequisition.hideLoadingIndicator())).subscribe((result)=>{
        this.primengTableHelperPurchaseRequisition.totalRecordsCount = result.length;
        this.primengTableHelperPurchaseRequisition.records = result;

        this.primengTableHelperPurchaseRequisition.hideLoadingIndicator();
      }
     
      );
    }
    getRequisitionData(event?: LazyLoadEvent){
      if( this.primengTableHelperPurchaseRequisition.shouldResetPaging(event)){
        this.paginatorPurchaseRequisition.changePage(0);
        return;
      }
      this.ViewRequisition();
    
    }
}