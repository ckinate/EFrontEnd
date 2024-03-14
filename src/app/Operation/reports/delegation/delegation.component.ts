import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CashAdvanceServiceServiceProxy, PayeeNameViewDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
  
})
export class DelegationComponent extends AppComponentBase implements OnInit {

  sdate : any;
  edate: any;
  user = '';
  isAdmin = false;
  madeBy = '';
  link = '';
  payeenamelist: PayeeNameViewDto[] = [];
  public dateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getStartOfDay()];
  constructor(injector: Injector,
    private _dateTimeService: DateTimeService,
    private _casetup: CashAdvanceServiceServiceProxy,

    ) {
      super(injector);
     }

  ngOnInit(): void {

    this.user = this.appSession.user.userName;
    this.isAdmin = this.isGranted('Pages.DelegationReportAdmin')  
    this.getUser();
  }

  ViewReport(myURL: string | URL) {
    this.sdate = this.dateRange[0].toFormat('yyyy-MM-dd');
    this.edate = this.dateRange[1].toFormat('yyyy-MM-dd');
    
    myURL =  AppConsts.cashADUrl + "?TypeId=3" + "&sDate="  + this.sdate + "&EDate=" + this.edate +  "&user="+ this.user + "&madeby="+ this.madeBy;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=1000,top=1000`;
    window.open(myURL,"_blank", params);    
  }
  getUser(){
   this.madeBy = this.appSession.user.userName;
   if (this.isAdmin) {
    this.madeBy = "all";
   }
  
    this._casetup.fetchCAPayeeName().subscribe(c => {
      this.payeenamelist = c;
    })
   
    } 

}
