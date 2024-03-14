import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { AuditTrailServiceServiceProxy, CustomLogDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { DateTime } from 'luxon';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class ErrorLogComponent extends AppComponentBase implements OnInit {

  @ViewChild('paginatorErrorLogs', { static: true }) paginatorErrorLogs: Paginator;
  //@ViewChild('dataTable', { static: false }) dataTable: ElementRef;

  @ViewChild('dataTableErrorLogs', { static: true }) dataTableErrorLogs: Table;
  @ViewChild('dataTableEntityChanges', { static: true }) dataTableEntityChanges: Table;
  @ViewChild('paginatorEntityChanges', { static: true }) paginatorEntityChanges: Paginator;

  errorForm: NgForm;
  primengTableHelper = new PrimengTableHelper();
  something : CustomLogDto;
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];


  hasException : boolean = undefined;
  //dave : boolean = false;
searchBox = '';
   //Filters
  transactionCode: string | null | undefined;
  serviceName: string | null | undefined;
  operationName: string | null | undefined;
  userName: string | null | undefined;
  tenantId: number | undefined =1;
  iPAddress: string | null | undefined;
  device: string | null | undefined;
  loggingType: number | undefined = 2;

  sampleDate: Date = new Date();
 startDate: DateTime = this._dateTimeService.getStartOfDay();
 // this.startDate.set
  endDate: DateTime = this._dateTimeService.getEndOfDayMinusDays(2);
//startDate = DateTime.local().startOf('day').toUTC().toISO();


  maxdate = new Date();

  public objectTypes: NameValueDto[];

  primengTableHelperErrorLogs = new PrimengTableHelper();
  primengTableHelperEntityChanges = new PrimengTableHelper();
  advancedFiltersAreShown = false;



  constructor(

    injector: Injector,
    private _auditTrail: AuditTrailServiceServiceProxy,
    private _dateTimeService: DateTimeService,
    private _router: Router,
    private _fileDownloadService: FileDownloadService,

  )


   {
    super(injector);

   }


  ngOnInit(): void {
//this.getLogs();
   }

   ExportTOExcel() {
    let error = document.getElementById('excel-table');
 const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(error);
 const wb: XLSX.WorkBook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 XLSX.writeFile(wb, 'ErrorLogSheet.xlsx');
}


loadActions()
{

 this.primengTableHelper.showLoadingIndicator();
 this._auditTrail.getTrailList().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result =>
{
     this.primengTableHelper.records = result.reverse();
     this.primengTableHelper.hideLoadingIndicator();
   });
}

getLogs(event?: LazyLoadEvent) {
 if (this.primengTableHelperErrorLogs.shouldResetPaging(event)) {
     this.paginatorErrorLogs.changePage(0);
     return;
 }
 this.primengTableHelperErrorLogs.showLoadingIndicator();
 this._auditTrail.getAudits(
     this.transactionCode,
     this.searchBox,
     this.operationName,
     this.userName,
     this._dateTimeService.getStartOfDayForDate(this.dateRange[0]),
     this._dateTimeService.getEndOfDayForDate(this.dateRange[1]),
     this.tenantId,
     this.iPAddress,
     this.device,
     this.loggingType,
     this.primengTableHelperErrorLogs.getSorting(this.dataTableErrorLogs),
     this.primengTableHelperErrorLogs.getMaxResultCount(this.paginatorErrorLogs, event),
     this.primengTableHelperErrorLogs.getSkipCount(this.paginatorErrorLogs, event)
 ).subscribe((result) => {
  // var newData = result.map((i,index) => ({...i,index}))
     this.primengTableHelperErrorLogs.totalRecordsCount = result.totalCount;
     this.primengTableHelperErrorLogs.records = result.items;
     console.log(result.items);
     this.primengTableHelperErrorLogs.hideLoadingIndicator();
     
   });
}

getErrorLogs()
{
 this.primengTableHelperErrorLogs.showLoadingIndicator();
 this._auditTrail.getErrorLog().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result =>
   {
     console.log(result);
        this.primengTableHelper.records = result;
        this.primengTableHelper.hideLoadingIndicator();
      });
}

//   getRecords()
//   {
//     this.primengTableHelperErrorLogs.showLoadingIndicator();
//     this._auditTrail.auditDropDown(this.hasException).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result =>
//       {
//         console.log(result);
//            this.primengTableHelper.records = result;
//            this.primengTableHelper.hideLoadingIndicator();
//          });
//   }
  
}
