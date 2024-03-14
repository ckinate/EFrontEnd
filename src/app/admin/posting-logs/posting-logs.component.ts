import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FinanceOperationServiceServiceProxy, PaymentPostingLogDto, PaymentPostingType } from '@shared/service-proxies/service-proxies';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotabledatadisplayComponent } from './notabledatadisplay.component';
import { requestItems } from './data';
import { LazyLoadEvent } from 'primeng';


@Component({
  selector: 'app-posting-logs',
  templateUrl: './posting-logs.component.html',
  styleUrls: ['./posting-logs.component.css']
})
export class PostingLogsComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  primengTableHelper = new PrimengTableHelper();

  limit = 0;
  cursor = 0;
  details: PaymentPostingLogDto;
  payload: any;
  data: PaymentPostingLogDto[];
  searchText: string;

  constructor( injector: Injector, private _finance: FinanceOperationServiceServiceProxy) {
    super(injector);
   }
  

  ngOnInit(): void {
    this.primengTableHelper.isLoading = true
    this._finance.getPostingLog(this.limit, this.cursor).subscribe(i => {
      this.primengTableHelper.records = i.map(t =>( {...t, postingType: PaymentPostingType[t.postingType]}));
      this.data = i;
      this.primengTableHelper.isLoading = false;
    })
  }

  close(): void {
    this.modal.hide();
  }

  search(): void {

    const temp = this.data
    this.primengTableHelper.records = temp.filter((i: PaymentPostingLogDto) => {
      const check = String(i.id).toLowerCase().includes(this.searchText.toLowerCase()) || 
      String(i.postingType).toLowerCase().includes(this.searchText.toLowerCase()) || 
      String(i.requestNo).toLowerCase().includes(this.searchText.toLowerCase()) || 
      String(i.postResponse).toLowerCase().includes(this.searchText.toLowerCase()) || 
      String(PaymentPostingType[i.postingType]).toLowerCase().includes(this.searchText.toLowerCase()) ||
      String(i.trackingId).toLowerCase().includes(this.searchText.toLowerCase())
      return check;
    }).map(p => ({...p, postingType: PaymentPostingType[p.postingType]}))

  }

  onShown(): void {

  }

  loadMore(event: LazyLoadEvent):void{
  }

  openDetails(records: PaymentPostingLogDto):void{
    this.details = records;
    this.cleanUp()
    this.modal.show();
  }

  clear():void {
    this.searchText = "";
    this._finance.getPostingLog(this.limit, this.cursor).subscribe(i => {
      this.primengTableHelper.records = i;
      this.data = i;
      this.primengTableHelper.isLoading = false;
    })
  }

  cleanUp():any{
    var detail = JSON.parse(this.details.transactionPayLoad);
    var beneficiaries =  detail?.PaymentRecords;
    var payload = [
      new requestItems("Payment Details", {"ScheduleId": detail?.ScheduleId, "Status": detail?.Status, 'Tracking Id': detail?.trackingId}, false, false, false, false),
      new requestItems("Beneficiary", beneficiaries, true, false, false, false),
    ]
    this.payload = payload;
    return payload;
  }


}
