import { ElementRef, PipeTransform, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injector } from '@angular/core';
import { Pipe } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CASetupDto, CashAdvanceServiceServiceProxy, CompanyCategoryStructureDto, CompanyStructureDto, OperatingExpenseServiceServiceProxy, PayeeNameViewDto, PaymentTransactionDto, TransactionTypeDto, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
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
  selector: 'app-careport',
  templateUrl: './careport.component.html',
  styleUrls: ['./careport.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class CAReportComponent extends AppComponentBase implements OnInit {

  @ViewChild('SampleDateTimePicker', {static: true}) sampleDateTimePicker: ElementRef;
  categoryList: CompanyCategoryStructureDto[] = [];
  listCompanyStructure: CompanyStructureDto[] =[];
  custCodeList: CompanyStructureDto[] = [];
  UserList: UserListDto[] = [];
  TransType: TransactionTypeDto[];
  RequestType: CASetupDto[];
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];
  constructor(injector: Injector,
    private _dateTimeService: DateTimeService,
    private _userService: UserServiceProxy,
    private _opexm: OperatingExpenseServiceServiceProxy,
    private _casetup: CashAdvanceServiceServiceProxy,
    ) {
      super(injector);
     }
     miscode = '0';
     User = '0';
     u: any;
     link = '';
     cancel_associated_session: any;
     sdate: string;
     edate: string;
       user: any
       CaStatus = 1;
       transTypeId = 0;
       madeBy = '';

       isAdmin = false;
       payeenamelist: PayeeNameViewDto[] = [];

     ngOnInit(): void {

      this.user = this.appSession.user.userName;
      this.isAdmin = this.isGranted('Pages.CashAdvanceReport.Admin')  


      this.loadCategories();
      this.getUser();
      this. getTran();
      this.getCompanyStructure(0);
     this.mis(0);
     
  }
  ViewReport(myURL: string | URL) {
    this.sdate = this.dateRange[0].toFormat('yyyy-MM-dd');
    this.edate = this.dateRange[1].toFormat('yyyy-MM-dd');

    if(this.madeBy == "0"){
      this.madeBy = "all";
    }
    
    myURL =  AppConsts.cashADUrl + "?TypeId=1" + "&sDate="  + this.sdate + "&EDate=" + this.edate + "&mis=" + this.miscode + "&CaStatus=" + this.CaStatus + "&transTypeId=" + this.transTypeId + "&user="+ this.user + "&madeby="+ this.madeBy;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(myURL,"_blank", params);    
  }
  getUser(){
   this.madeBy = this.appSession.user.userName;
   if (this.isAdmin) {
    this.madeBy = "0";
   }
  
    this._casetup.fetchCAPayeeName().subscribe(c => {
      this.payeenamelist = c;
    })
   
    } 
  loadCategories(){
    this._userService.getCoyCategory().subscribe(result =>{    
    this.categoryList = result;    

    });
    }
  getCompanyStructure(val:any)
    {
        
    this._userService.getCompanyStructures(val).subscribe(result => { 
        this.listCompanyStructure = result;
        
        this.user.misCode = null;
    });
    }


    mis(val:any)
    {
      
      this._userService.getMisCode().subscribe(result =>
            {
             this.custCodeList = result;
             
            });
    }

    getTran()
    {


      this._casetup.getCashAdvanceSetup().subscribe( x => {

 this.RequestType = x
 

      });
      

    }
}
