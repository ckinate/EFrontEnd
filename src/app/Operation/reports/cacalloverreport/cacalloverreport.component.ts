import { Component, ElementRef, Injector, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentsComponent } from '@app/operation/documents/documents.component';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CompanyCategoryStructureDto, CompanyStructureDto, ExpenseReportServiceServiceProxy, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';

@Pipe({ name: 'finsafe' })
export class FINSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer,

    ) {

    }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-cacalloverreport',
  templateUrl: './cacalloverreport.component.html',
  styleUrls: ['./cacalloverreport.component.css']
})
export class CacalloverreportComponent extends AppComponentBase implements OnInit {
  @ViewChild('appdocuments', { static: true}) appdocuments: DocumentsComponent;
  opid: number;
  @ViewChild('SampleDateTimePicker', {static: true}) sampleDateTimePicker: ElementRef;
  PaymentProcessor = 'All';
  ProcessorList: any;
  RequestRef = 'All';
  RefList: any;
  itemList: any;
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];

  constructor(injector: Injector,
    private _dateTimeService: DateTimeService,
    private _userService: UserServiceProxy,
    private _opex: ExpenseReportServiceServiceProxy
    ) {
    super(injector); }

  link = '';
  sdate: DateTime;
  edate: DateTime;

  ngOnInit(): void {
    this.opid = 0;
    this.sdate =  this.dateRange[0];
    this.edate  = this.dateRange[1];

    this.onRequestRefChange();
  }

  ViewReport(pVoucherNo, OperationID) {
    let ss =  AppConsts.CallOverUrl + '?TypeId=7' + '&RequestNumber=' + pVoucherNo  + '&OPID=' + OperationID;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
window.open(ss, '_blank', params);

    }
  getProcessors() {
this._opex.getCallOverProcessorByDate(this.opid, this.sdate, this.edate).subscribe((v) => {
  this.ProcessorList = v;

});
  }

  getRefs() {
    this._opex.getCallOverPaymentRefByDate(this.opid, this.sdate, this.edate, this.PaymentProcessor).subscribe((v) => {
      this.RefList = v;

    });
  }


  onProcessorChange() {
    this.onRequestRefChange();

  }
  showDocument(ref, id) {
    let PID = 7;
    console.log(id);
    if (id === 22 || id === 20) {
      PID = 21;
    }
    this.appdocuments.ShowPaymentAttachment(ref, PID);

  }
  onRequestRefChange() {

    this._opex.getCallOverMaster(this.opid, this.sdate, this.edate, this.PaymentProcessor, this.RequestRef).subscribe((x) => {
      this.primengTableHelper.records = x;

    });

  }
  onTypeChange() {
    this.RequestRef = 'All';
    this.getProcessors();
    this.getRefs();
    this.onRequestRefChange();
  }
    onValueChange(event) {

 this.sdate = event[0];
 this.edate = event[1];
 this.getProcessors();
 this.getRefs();
    }

}
