import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AllocationDto, CreateRequisitionDto, InventoryDto, InventoryTypeDto, ItemDto, NonFixedAssetAllocationServicesServiceProxy, RequisitionServiceServiceProxy, StoreDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/public_api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';

@Component({
    templateUrl: './UserAllocation.component.html',
    styleUrls: ['./UserAllocation.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class UserAllocationComponent extends AppComponentBase implements  OnInit{

    requsitionValue : CreateRequisitionDto = new CreateRequisitionDto();
    storeId: any;
    storeLocat: StoreDto[] = [];
    productItems : CreateRequisitionDto[]= [];
    itemRef : string;
    allocationValue: AllocationDto = new AllocationDto();
    saving = false;
    allocate : CreateRequisitionDto[] = [];
    qtyAllocated : number;
    allocatedRemark: string;
    disabledAllocate: boolean = true;
    

    @ViewChild('AllocationTable', { static: true }) AllocationTable: Table;
    @ViewChild("paginatorAllocation",{static:true}) paginatorAllocation:Paginator;

    primengTableHelperAllocation = new PrimengTableHelper();

    constructor(injector: Injector, private reqService : RequisitionServiceServiceProxy, private allocateService: NonFixedAssetAllocationServicesServiceProxy){
        super(injector)
       }


    ngOnInit(): void {

    }

    selectStore(event: any){
        this.storeId = event.target.value;
      }
      selectedItem(event: any){
        this.requsitionValue.referenceNumber = event.target.value;
       }
    
      getStore(){
        this.reqService.getAllStoreItem().subscribe((result)=>{
         this.storeLocat = result;
         this.getAllRequisition();
          
         
        })
       }
       viewRequisition(){
        this. primengTableHelperAllocation.showLoadingIndicator();
        this.allocateService.getAllItemToAllocate(this.itemRef).pipe(finalize(()=>this.primengTableHelperAllocation.hideLoadingIndicator()
        )).subscribe((result)=>{
          this. primengTableHelperAllocation.totalRecordsCount = result.length;
          this. primengTableHelperAllocation.records = result;
          this.allocate = result;
          this. primengTableHelperAllocation.hideLoadingIndicator();
        })
      }
      RequisitionData(event?: LazyLoadEvent){
        if(this.primengTableHelperAllocation.shouldResetPaging(event)){
          this.paginatorAllocation.changePage(0);
          return;
        }
        this.viewRequisition();
      }

      getAllRequisition(){
        
          this.allocateService.getAllRefNoToAllocate(this.storeId).subscribe((result)=>{
            this.productItems = result;

            this.viewRequisition();
          })
       
    }
    checkEach( event: any, i: number){
      this.disabledAllocate = !event.checked;
     var checkId = this.allocate.filter(e=>e.checked);
     checkId.forEach(el=>{
       if(el.id == i){
        event.checked = event.target.checked;
        this.allocationValue.itemDesc = el.description;
        this.allocationValue.qtyAllocated = this.qtyAllocated;
        this.allocationValue.allocationRemark = this.allocatedRemark;
        this.allocationValue.qtyOnHand = el.qtyOnHand;

       }
     })
    }
    checkAll(event: any){
      this.allocate.forEach(x=>x.checked = event.target.checked)
    }
    allocationButton(){
     this.message.confirm(
       this.l("Do you really want to Proceed?"),
       this.l("Are you Sure?"),
       (isConfirm)=>{
        this.saving = false;
        this.showMainSpinner();
        this.allocateService.allocation(this.allocationValue).pipe(finalize(()=> this.saving = false)).subscribe(()=>{
          this.message.success("Allocation done successfully");
        })

        this.saving = true;
        this.hideMainSpinner();
       }
     )
    }
}