import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateRequisitionDto, InventoryDto, InventoryTypeDto, ItemDto, RequisitionServiceServiceProxy, StoreDto, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
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
    templateUrl: './nonFixedAssetRequisition.component.html',
    styleUrls: ['./nonFixedAssetRequisition.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NonFixedAssetRequisitionComponent extends AppComponentBase implements  OnInit{

    NonFixedAssetSave: NgForm;
    requsitionValue : CreateRequisitionDto = new CreateRequisitionDto();
    storeId: any;
    storeLocat: StoreDto[] = [];
    inventoryItems : InventoryTypeDto[] = [];
    inventoryId : any;
    productItems : ItemDto[]= [];
    productCode: ItemDto [] = [];
    itemId: any;




  saving = false;
  startdate: moment.Moment;
  hasDate = false;
  mindate : Date;

  @ViewChild('RequisitionTable', { static: true }) RequisitionTable: Table;
  @ViewChild("paginatorRequisition",{static:true}) paginatorRequisition:Paginator;

  primengTableHelperRequisition = new PrimengTableHelper();


 constructor(injector: Injector, private reqService : RequisitionServiceServiceProxy){
  super(injector)
 }

 ngOnInit(): void {
  //this.getStore();
  //this.getInventory();
  }
  selectStore(event: any){
    this.storeId = event.target.value;
  }
  selectedItem(event: any){
   this.requsitionValue.description = event.target.value;
  }
  selectedInvType(event: any){
    this.inventoryId = event.target.value;
  }

  saveItem(addItem: NgForm){

      this.message.confirm(
          this.l("Do you really want to Proceed?"),
          this.l("Are you Sure?"),
          (isConfirm)=>{
              this.saving = false;
              this.showMainSpinner();
              this.reqService.createRequisition(this.requsitionValue).pipe(finalize(()=>this.saving = false)).subscribe((r)=>{
                this.notify.success(this.l("Save successfully"));
                this.message.success(this.l("Save Successfully")  + ' Ref: ' + r + ' and' + 'Sent For Approval');
            })

              this.saving = true;
              this.hideMainSpinner();
          }
      )

    addItem.resetForm();
  }
  getStore(){
   this.reqService.getAllStoreItem().subscribe((result)=>{
    this.storeLocat = result;

    this.getProductItem();
   })
  }
  getInventory(){
      this.reqService.getAllInVentoryType().subscribe((result)=>{
          this.inventoryItems = result;

      })
  }
  getProductItem(){
      if(this.storeId || this.storeId.lenghth != 0) {

        this.reqService.getAllProductItem(this.storeId).subscribe((result)=>{
            this.productItems = result;

            this.getProductCode();
           })
      }

  }
  getProductCode(){
      this.reqService.getProductCode(this.requsitionValue.description).subscribe((result)=>{
       this.productCode = result;
      })
  }
  viewRequisition(){
    this.primengTableHelperRequisition.showLoadingIndicator();
    this.reqService.getAllRequisition().pipe(finalize(()=>this.primengTableHelperRequisition.hideLoadingIndicator()
    )).subscribe((result)=>{
      this.primengTableHelperRequisition.totalRecordsCount = result.length;
      this.primengTableHelperRequisition.records = result;
      this.primengTableHelperRequisition.hideLoadingIndicator();
    })
  }
  RequisitionData(event?: LazyLoadEvent){
    if(this.primengTableHelperRequisition.shouldResetPaging(event)){
      this.paginatorRequisition.changePage(0);
      return;
    }
    this.viewRequisition();
  }

}
